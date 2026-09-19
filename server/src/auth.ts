import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export type AuthenticatedRequest = Request & { user?: User; userId?: string };

const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret || configuredJwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be set and contain at least 32 characters');
}
const jwtSecret: string = configuredJwtSecret;

export const prisma = new PrismaClient();

export function createToken(user: User): string {
  return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '8h' });
}

function cookieToken(req: Request): string | undefined {
  const cookies = req.header('cookie')?.split(';').map((part) => part.trim()) || [];
  const authCookie = cookies.find((cookie) => cookie.startsWith('smarak_auth='));
  return authCookie?.slice('smarak_auth='.length);
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : cookieToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    if (typeof payload.sub !== 'string') throw new Error('Invalid token subject');
    req.userId = payload.sub;
    prisma.user.findUnique({ where: { id: payload.sub } }).then((user) => {
      if (!user) {
        res.status(401).json({ error: 'User account no longer exists' });
        return;
      }
      req.user = user;
      next();
    }).catch(() => {
      res.status(500).json({ error: 'Failed to validate user session' });
    });
  } catch {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }
  next();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
