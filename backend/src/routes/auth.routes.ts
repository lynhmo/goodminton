// src/routes/auth.routes.ts
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  const { identifier, password } = req.body as { identifier?: string; password?: string };

  if (!identifier || !password) {
    res.status(400).json({ error: 'Tên đăng nhập/email và mật khẩu là bắt buộc' });
    return;
  }

  const normalized = identifier.trim().toLowerCase();
  const isEmail = normalized.includes('@');
  const query = supabase
    .from('members')
    .select('id, username, email, password_hash, display_name, phone, avatar_url, status')
    .eq(isEmail ? 'email' : 'username', normalized)
    .eq('status', 'active')
    .single();

  const { data: member } = await query;

  if (!member?.password_hash || !(await bcrypt.compare(password, member.password_hash))) {
    res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không đúng' });
    return;
  }

  // Lấy role từ group_members
  const { data: gm } = await supabase
    .from('group_members')
    .select('role, group_id')
    .eq('member_id', member.id)
    .eq('status', 'active')
    .single();

  req.session.userId = member.id;
  req.session.email = member.email ?? '';
  req.session.role = (gm?.role as 'super_admin' | 'admin' | 'member') ?? 'member';
  req.session.groupId = gm?.group_id ?? '';

  res.json({
    user: {
      id: member.id,
      username: member.username,
      email: member.email,
      display_name: member.display_name,
      phone: member.phone,
      role: req.session.role,
      groupId: req.session.groupId,
    },
  });
});

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  const { username, password, display_name, phone, email, invite_code, type = 'fixed' } = req.body as {
    username?: string;
    password?: string;
    display_name?: string;
    phone?: string;
    email?: string;
    invite_code?: string;
    type?: 'fixed' | 'guest';
  };

  const normalizedUsername = username?.trim().toLowerCase() ?? '';
  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = phone?.replace(/\s/g, '') ?? '';

  if (!normalizedUsername || !password || !display_name || !normalizedPhone) {
    res.status(400).json({ error: 'Username, tên, số điện thoại và mật khẩu là bắt buộc' });
    return;
  }
  if (!/^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername)) {
    res.status(400).json({ error: 'Username chỉ gồm chữ, số, _, dài 3-30 ký tự' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Mật khẩu phải có ít nhất 8 ký tự' });
    return;
  }
  if (!/^0\d{9}$/.test(normalizedPhone)) {
    res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
    return;
  }
  if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    res.status(400).json({ error: 'Email không hợp lệ' });
    return;
  }

  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .or(`username.eq.${normalizedUsername},phone.eq.${normalizedPhone}${normalizedEmail ? `,email.eq.${normalizedEmail}` : ''}`)
    .maybeSingle();

  if (existing) {
    res.status(409).json({ error: 'Username, email hoặc số điện thoại đã tồn tại' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const { data: member, error } = await supabase
    .from('members')
    .insert({ username: normalizedUsername, email: normalizedEmail, password_hash, display_name, phone: normalizedPhone })
    .select('id, username, email, display_name, phone, avatar_url, status')
    .single();

  if (error || !member) {
    res.status(400).json({ error: error?.message ?? 'Không thể tạo tài khoản' });
    return;
  }

  if (invite_code) {
    const { data: group } = await supabase.from('groups').select('id').eq('invite_code', invite_code).single();
    if (group) {
      await supabase.from('group_members').insert({ group_id: group.id, member_id: member.id, role: 'member', type });
    }
  }

  res.status(201).json({ user: member });
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
    .select('id, username, email, display_name, phone, avatar_url, status')
    .eq('id', req.session.userId)
    .single();

  if (!member) {
    res.status(404).json({ error: 'Không tìm thấy thông tin người dùng' });
    return;
  }

  res.json({ user: { ...member, role: req.session.role, groupId: req.session.groupId } });
});
