// src/routes/auth.routes.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    return;
  }

  // Dùng Supabase Auth để verify
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    return;
  }

  // Lấy role từ group_members
  const { data: gm } = await supabase
    .from('group_members')
    .select('role, group_id')
    .eq('member_id', data.user.id)
    .eq('status', 'active')
    .single();

  req.session.userId = data.user.id;
  req.session.email = data.user.email ?? email;
  req.session.role = (gm?.role as 'admin' | 'member') ?? 'member';
  req.session.groupId = gm?.group_id ?? '';

  res.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      role: req.session.role,
      groupId: req.session.groupId,
    },
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, async (req, res) => {
  const { data: member } = await supabase
    .from('members')
    .select('id, email, display_name, phone, avatar_url, status')
    .eq('id', req.session.userId)
    .single();

  if (!member) {
    res.status(404).json({ error: 'Không tìm thấy thông tin người dùng' });
    return;
  }

  res.json({ user: { ...member, role: req.session.role, groupId: req.session.groupId } });
});
