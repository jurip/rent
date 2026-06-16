import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../db/client.js';
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  generateResetToken,
  verifyEmailToken,
  verifyRefreshToken,
  TokenPayload,
} from '../lib/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email.js';

export class AuthService {
  async register(email: string, password: string, fullName: string, phone: string, role: 'renter' | 'landlord') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Аккаунт с таким email уже существует', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user first to get real ID, then generate token
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role,
      },
    });

    const emailToken = generateEmailToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailToken,
        emailTokenExp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, emailToken);

    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Неверный email или пароль', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError('Неверный email или пароль', 401);
    }

    if (!user.emailVerified) {
      throw new AppError('Пожалуйста, подтвердите email перед входом', 403);
    }

    const payload: TokenPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async refreshAccessToken(token: string) {
    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AppError('Недействительный или просроченный токен обновления', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== token) {
      throw new AppError('Недействительный токен обновления', 401);
    }

    const newPayload: TokenPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async verifyEmail(token: string) {
    let payload: { userId: string; type: string };
    try {
      payload = verifyEmailToken(token);
    } catch {
      throw new AppError('Недействительная или просроченная ссылка подтверждения', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new AppError('Пользователь не найден', 404);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailToken: null, emailTokenExp: null },
    });
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return;

    const resetToken = generateResetToken(user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    });

    await sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: { userId: string; type: string };
    try {
      payload = verifyEmailToken(token);
    } catch {
      throw new AppError('Недействительная или просроченная ссылка сброса', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.resetToken !== token || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new AppError('Недействительная или просроченная ссылка сброса', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null,
        refreshToken: null, // Invalidate all sessions
      },
    });
  }

  sanitizeUser(user: { id: string; email: string; fullName: string; phone: string; role: string; avatarUrl: string | null; emailVerified: boolean; createdAt: Date }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
