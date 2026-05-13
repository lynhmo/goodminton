// src/types/session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    role: 'super_admin' | 'admin' | 'member';
    groupId: string;
    email: string;
  }
}
