// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Chưa đăng nhập' });
    return;
  }
  if (req.session?.role !== 'admin' && req.session?.role !== 'super_admin') {
    res.status(403).json({ error: 'Không có quyền admin' });
    return;
  }
  next();
}
