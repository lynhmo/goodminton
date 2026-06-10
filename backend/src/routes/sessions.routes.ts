// src/routes/sessions.routes.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

export const sessionsRouter = Router();

// GET /api/sessions
sessionsRouter.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*, attendance(count)')
    .eq('group_id', req.session.groupId)
    .order('date', { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ data });
});

// GET /api/sessions/:id
sessionsRouter.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      attendance (
        id, is_present, amount_charged,
        members (id, display_name, avatar_url)
      )
    `)
    .eq('id', req.params.id)
    .eq('group_id', req.session.groupId)
    .single();

  if (error || !data) {
    res.status(404).json({ error: 'Không tìm thấy buổi tập' });
    return;
  }

  res.json({ data });
});

// POST /api/sessions — Tạo buổi mới (admin only)
sessionsRouter.post('/', requireAdmin, async (req, res) => {
  const { date, court_fee, shuttlecock_qty = 0, shuttlecock_price = 0, note } = req.body as {
    date: string;
    court_fee: number;
    shuttlecock_qty?: number;
    shuttlecock_price?: number;
    note?: string;
  };

  if (!date || typeof court_fee !== 'number') {
    res.status(400).json({ error: 'date và court_fee là bắt buộc' });
    return;
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      group_id: req.session.groupId,
      created_by: req.session.userId,
      date,
      court_fee,
      shuttlecock_qty,
      shuttlecock_price,
      note,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(201).json({ data });
});

// PATCH /api/sessions/:id — Cập nhật buổi (admin, chỉ khi draft/pending)
sessionsRouter.patch('/:id', requireAdmin, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  // Block direct status change to 'settled' — must use POST /:id/settle
  if (body.status === 'settled') {
    res.status(403).json({ error: 'Không thể tự chốt buổi qua PATCH. Dùng API settle.' });
    return;
  }

  const allowed = ['court_fee', 'shuttlecock_qty', 'shuttlecock_price', 'note', 'status'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', req.params.id)
    .eq('group_id', req.session.groupId)
    .in('status', ['draft', 'pending'])
    .select()
    .single();

  if (error || !data) {
    res.status(400).json({ error: error?.message ?? 'Không thể cập nhật buổi đã chốt' });
    return;
  }

  res.json({ data });
});

// POST /api/sessions/:id/settle — Chốt buổi, trừ tiền (admin only)
sessionsRouter.post('/:id/settle', requireAdmin, async (req, res) => {
  const sessionId = req.params.id;

  // Lấy session
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('group_id', req.session.groupId)
    .single();

  if (!session) {
    res.status(404).json({ error: 'Không tìm thấy buổi tập' });
    return;
  }

  if (session.status === 'settled') {
    res.status(400).json({ error: 'Buổi đã được chốt trước đó' });
    return;
  }

  // Lấy danh sách có mặt
  const { data: attendees } = await supabase
    .from('attendance')
    .select('id, member_id')
    .eq('session_id', sessionId)
    .eq('is_present', true);

  if (!attendees || attendees.length === 0) {
    res.status(400).json({ error: 'Chưa có ai điểm danh' });
    return;
  }

  const totalCost = session.total_cost ?? session.court_fee + session.shuttlecock_qty * session.shuttlecock_price;
  const count = attendees.length;

  // Làm tròn xuống theo đơn vị 1000đ
  const perPerson = Math.floor(totalCost / count / 1000) * 1000;
  const remainder = totalCost - perPerson * count;

  // Kiểm tra tất cả attendees tồn tại trong group_members trước khi trừ tiền
  const memberIds = attendees.map((a) => a.member_id);
  const { data: allGms } = await supabase
    .from('group_members')
    .select('id, member_id, balance')
    .eq('group_id', req.session.groupId)
    .in('member_id', memberIds);

  const missingIds = memberIds.filter(
    (mid) => !allGms?.some((gm) => gm.member_id === mid),
  );
  if (missingIds.length > 0) {
    res.status(400).json({ error: `Một số thành viên không có trong nhóm: ${missingIds.join(', ')}` });
    return;
  }

  // Batch update group_members + insert transactions + update attendance
  const gmMap = new Map(allGms!.map((gm) => [gm.member_id, gm]));
  const updates: Array<{ id: string; balance: number }> = [];
  const txnInserts: Array<Record<string, unknown>> = [];
  const attUpdates: Array<{ id: string; amount_charged: number }> = [];

  for (const att of attendees) {
    const gm = gmMap.get(att.member_id)!;
    const newBalance = gm.balance - perPerson;
    updates.push({ id: gm.id, balance: newBalance });
    txnInserts.push({
      group_member_id: gm.id,
      session_id: sessionId,
      type: 'session_charge',
      amount: -perPerson,
      balance_after: newBalance,
      note: `Buổi tập ${session.date}`,
    });
    attUpdates.push({ id: att.id, amount_charged: perPerson });
  }

  // Execute all updates in parallel
  await Promise.all([
    ...updates.map((u) =>
      supabase.from('group_members').update({ balance: u.balance }).eq('id', u.id),
    ),
    supabase.from('transactions').insert(txnInserts),
    ...attUpdates.map((a) =>
      supabase.from('attendance').update({ amount_charged: a.amount_charged }).eq('id', a.id),
    ),
    supabase
      .from('sessions')
      .update({ status: 'settled', per_person: perPerson, remainder, attendee_count: count })
      .eq('id', sessionId),
  ]);

  res.json({ success: true, perPerson, remainder, attendeeCount: count });
});

// POST /api/sessions/:id/revert — Hoàn tác buổi đã chốt (admin only)
sessionsRouter.post('/:id/revert', requireAdmin, async (req, res) => {
  const sessionId = req.params.id;

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('group_id', req.session.groupId)
    .single();

  if (!session || session.status !== 'settled') {
    res.status(400).json({ error: 'Chỉ có thể hoàn tác buổi đã chốt' });
    return;
  }

  // Lấy transactions của buổi
  const { data: txns } = await supabase
    .from('transactions')
    .select('id, group_member_id, amount')
    .eq('session_id', sessionId)
    .eq('type', 'session_charge');

  if (txns) {
    for (const txn of txns) {
      const { data: gm } = await supabase
        .from('group_members')
        .select('id, balance')
        .eq('id', txn.group_member_id)
        .single();

      if (!gm) continue;

      const refund = Math.abs(txn.amount);
      const newBalance = gm.balance + refund;

      await supabase
        .from('group_members')
        .update({ balance: newBalance })
        .eq('id', gm.id);

      await supabase.from('transactions').insert({
        group_member_id: gm.id,
        session_id: sessionId,
        type: 'refund',
        amount: refund,
        balance_after: newBalance,
        note: `Hoàn tiền buổi ${session.date}`,
      });
    }
  }

  await supabase
    .from('sessions')
    .update({ status: 'pending', per_person: 0, remainder: 0, attendee_count: 0 })
    .eq('id', sessionId);

  res.json({ success: true });
});

// DELETE /api/sessions/:id (admin, chỉ khi draft)
sessionsRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', req.params.id)
    .eq('group_id', req.session.groupId)
    .eq('status', 'draft');

  if (error) {
    res.status(400).json({ error: 'Không thể xóa buổi đã được duyệt' });
    return;
  }

  res.json({ success: true });
});
