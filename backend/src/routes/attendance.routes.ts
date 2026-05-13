// src/routes/attendance.routes.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

export const attendanceRouter = Router();

// GET /api/attendance?sessionId=xxx
attendanceRouter.get('/', requireAuth, async (req, res) => {
  const { sessionId } = req.query as { sessionId?: string };

  if (!sessionId) {
    res.status(400).json({ error: 'sessionId là bắt buộc' });
    return;
  }

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      id, is_present, amount_charged, created_at,
      members (id, display_name, avatar_url)
    `)
    .eq('session_id', sessionId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ data });
});

// POST /api/attendance — Điểm danh hàng loạt (admin only)
// Body: { sessionId, memberIds: string[] }
attendanceRouter.post('/', requireAdmin, async (req, res) => {
  const { sessionId, memberIds } = req.body as { sessionId: string; memberIds: string[] };

  if (!sessionId || !Array.isArray(memberIds)) {
    res.status(400).json({ error: 'sessionId và memberIds là bắt buộc' });
    return;
  }

  // Upsert attendance
  const records = memberIds.map((memberId) => ({
    session_id: sessionId,
    member_id: memberId,
    is_present: true,
  }));

  const { data, error } = await supabase
    .from('attendance')
    .upsert(records, { onConflict: 'session_id,member_id' })
    .select();

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Cập nhật attendee_count trên session
  await supabase
    .from('sessions')
    .update({ attendee_count: memberIds.length, status: 'pending' })
    .eq('id', sessionId)
    .eq('status', 'draft');

  res.json({ data });
});

// PATCH /api/attendance/:id — Toggle is_present (admin only)
attendanceRouter.patch('/:id', requireAdmin, async (req, res) => {
  const { is_present } = req.body as { is_present: boolean };

  const { data, error } = await supabase
    .from('attendance')
    .update({ is_present })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !data) {
    res.status(400).json({ error: error?.message ?? 'Không tìm thấy điểm danh' });
    return;
  }

  res.json({ data });
});
