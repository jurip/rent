import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService, AppError } from '../services/auth.service.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
const authService = new AuthService();

// Schemas
const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  fullName: z.string().min(2, 'Имя и фамилия обязательны'),
  phone: z.string().min(5, 'Номер телефона обязателен'),
  role: z.enum(['renter', 'landlord']),
});

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Неверный формат email'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName, phone, role } = req.body;
    const result = await authService.register(email, password, fullName, phone, role);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Регистрация прошла успешно. Проверьте почту для подтверждения аккаунта.',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: 'Токен обновления не предоставлен' });
      return;
    }
    const result = await authService.refreshAccessToken(token);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req.user!.userId);
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'Вы успешно вышли из системы' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/verify-email?token=...
router.get('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.query.token as string;
    if (!token) {
      res.status(400).json({ success: false, message: 'Требуется токен подтверждения' });
      return;
    }
    await authService.verifyEmail(token);
    res.json({ success: true, message: 'Email успешно подтверждён. Теперь вы можете войти.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ success: true, message: 'Если аккаунт с таким email существует, на него отправлена ссылка для сброса пароля.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.json({ success: true, message: 'Пароль успешно сброшен. Теперь вы можете войти с новым паролем.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/dev/verify-token (DEV ONLY: shows token for last registered user)
if (process.env.NODE_ENV !== 'production') {
  router.get('/dev/verify-token', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { prisma: db } = await import('../db/client.js');
      const user = await db.user.findFirst({
        where: { emailToken: { not: null } },
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, emailToken: true },
      });
      if (!user) {
        res.json({ success: false, message: 'Неподтверждённые пользователи не найдены' });
        return;
      }
      const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${user.emailToken}`;
      res.json({ success: true, data: { email: user.email, token: user.emailToken, link } });
    } catch (error) {
      next(error);
    }
  });
}

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prisma } = await import('../db/client.js');
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ success: false, message: 'Пользователь не найден' });
      return;
    }
    res.json({ success: true, data: authService.sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

// Error handler for auth routes
router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  console.error('Auth error:', err);
  res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
});

export default router;
