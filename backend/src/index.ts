// src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import { authRouter } from './routes/auth.routes.js';
import { membersRouter } from './routes/members.routes.js';
import { sessionsRouter } from './routes/sessions.routes.js';
import { attendanceRouter } from './routes/attendance.routes.js';
import { rankingsRouter } from './routes/rankings.routes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ── Middlewares ──────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(process.env.SESSION_MAX_AGE_MS ?? 7 * 24 * 60 * 60 * 1000),
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  }),
);

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/rankings', rankingsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route không tồn tại' });
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV ?? 'development'}`);
});
