import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh';
const ACCESS_EXP = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXP = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}

export function generateEmailToken(userId: string): string {
  return jwt.sign({ userId, type: 'email_verify' }, ACCESS_SECRET, { expiresIn: '24h' });
}

export function generateResetToken(userId: string): string {
  return jwt.sign({ userId, type: 'password_reset' }, ACCESS_SECRET, { expiresIn: '1h' });
}

export function verifyEmailToken(token: string): { userId: string; type: string } {
  return jwt.verify(token, ACCESS_SECRET) as { userId: string; type: string };
}
