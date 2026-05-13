// src/types/session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: 'admin' | 'member';
    groupId: string;
    email: string;
  }
}
