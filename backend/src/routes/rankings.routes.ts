// src/routes/rankings.routes.ts
import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const rankingsRouter = Router();

// GET /api/rankings — Top members by sessions attended
rankingsRouter.get('/', requireAuth, async (req, res) => {
  // Đếm số buổi tập có mặt của mỗi member trong group
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      member_id,
      members (id, display_name, avatar_url),
      sessions!inner (group_id, status)
    `)
    .eq('sessions.group_id', req.session.groupId)
    .eq('sessions.status', 'settled')
    .eq('is_present', true);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  // Tổng hợp count theo member
  const countMap = new Map<string, { member: unknown; count: number }>();
  for (const row of data ?? []) {
    const existing = countMap.get(row.member_id);
    if (existing) {
      existing.count += 1;
    } else {
      countMap.set(row.member_id, { member: row.members, count: 1 });
    }
  }

  const rankings = Array.from(countMap.entries())
    .map(([memberId, val]) => ({ memberId, member: val.member, sessionsAttended: val.count }))
    .sort((a, b) => b.sessionsAttended - a.sessionsAttended)
    .slice(0, 10);

  res.json({ data: rankings });
});
