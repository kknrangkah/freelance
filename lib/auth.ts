/**
 * Autentikasi & Sesi Token Admin (lib/auth.ts)
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const adminTokens = new Set<string>();

export function createAdminSession(): string {
  const token = crypto.randomBytes(24).toString('hex');
  adminTokens.add(token);
  return token;
}

export function removeAdminSession(token?: string): void {
  if (token) adminTokens.delete(token);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token || !adminTokens.has(token)) {
    res.status(401).json({ error: 'Sesi admin berakhir. Silakan login kembali.' });
    return;
  }
  next();
}

