// src/routes/members.routes.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

export const membersRouter = Router();

// GET /api/members — Danh sách members trong group
membersRouter.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      id, role, type, balance, status, joined_at,
      members (id, email, display_name, phone, avatar_url)
    `)
    .eq('group_id', req.session.groupId)
    .order('joined_at', { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ data });
});

// GET /api/members/:id
membersRouter.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      id, role, type, balance, status, joined_at,
      members (id, email, display_name, phone, avatar_url)
    `)
    .eq('group_id', req.session.groupId)
    .eq('member_id', req.params.id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: 'Không tìm thấy thành viên' });
    return;
  }

  res.json({ data });
});

// POST /api/members — Thêm member vào group (admin only)
membersRouter.post('/', requireAdmin, async (req, res) => {
  const { email, display_name, phone, role = 'member', type = 'fixed' } = req.body as {
    email: string;
    display_name: string;
    phone: string;
    role?: 'admin' | 'member';
    type?: 'fixed' | 'guest';
  };

  if (!email || !display_name || !phone) {
    res.status(400).json({ error: 'Email, tên và số điện thoại là bắt buộc' });
    return;
  }

  // Tìm member theo email
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('email', email)
    .single();

  if (!existing) {
    res.status(404).json({ error: 'Người dùng chưa có tài khoản. Họ cần đăng ký trước.' });
    return;
  }

  const { data, error } = await supabase
    .from('group_members')
    .insert({ group_id: req.session.groupId, member_id: existing.id, role, type })
    .select()
    .single();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.status(201).json({ data });
});

// PATCH /api/members/:id/balance — Điều chỉnh số dư (admin only)
membersRouter.patch('/:id/balance', requireAdmin, async (req, res) => {
  const { amount, note } = req.body as { amount: number; note?: string };

  if (typeof amount !== 'number') {
    res.status(400).json({ error: 'amount phải là số' });
    return;
  }

  // Lấy balance hiện tại
  const { data: gm } = await supabase
    .from('group_members')
    .select('id, balance')
    .eq('group_id', req.session.groupId)
    .eq('member_id', req.params.id)
    .single();

  if (!gm) {
    res.status(404).json({ error: 'Không tìm thấy thành viên' });
    return;
  }

  const newBalance = gm.balance + amount;

  const { error: updateErr } = await supabase
    .from('group_members')
    .update({ balance: newBalance })
    .eq('id', gm.id);

  if (updateErr) {
    res.status(500).json({ error: updateErr.message });
    return;
  }

  // Ghi transaction
  await supabase.from('transactions').insert({
    group_member_id: gm.id,
    type: amount >= 0 ? 'deposit' : 'adjustment',
    amount,
    balance_after: newBalance,
    note: note ?? (amount >= 0 ? 'Nạp tiền' : 'Điều chỉnh số dư'),
  });

  res.json({ balance: newBalance });
});

// DELETE /api/members/:id — Xóa khỏi group (admin only)
membersRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('group_members')
    .update({ status: 'inactive' })
    .eq('group_id', req.session.groupId)
    .eq('member_id', req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ success: true });
});
