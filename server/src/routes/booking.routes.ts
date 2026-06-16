import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../db/client.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const createSchema = z.object({
  propertyId: z.string().uuid(),
  moveInDate: z.string(),
  durationMonths: z.number().int().min(1),
  message: z.string(),
});

const updateSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  responseMessage: z.string().optional(),
});

// POST /api/bookings — renter creates booking request
router.post('/', authenticate, requireRole('renter'), validate(createSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId, moveInDate, durationMonths, message } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { landlordId: true } });
    if (!property) {
      res.status(404).json({ success: false, message: 'Объект не найден' });
      return;
    }
    if (property.landlordId === req.user!.userId) {
      res.status(400).json({ success: false, message: 'Вы не можете забронировать собственный объект' });
      return;
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        propertyId,
        renterId: req.user!.userId,
        landlordId: property.landlordId,
        moveInDate: new Date(moveInDate),
        durationMonths,
        message,
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings — list bookings for current user
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const where = req.user!.role === 'landlord'
      ? { landlordId: req.user!.userId }
      : { renterId: req.user!.userId };

    const status = req.query.status as string | undefined;
    if (status) where.status = status as any;

    const bookings = await prisma.bookingRequest.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, images: { take: 1, orderBy: { order: 'asc' } } } },
        renter: { select: { id: true, fullName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id — landlord accepts/rejects
router.patch('/:id', authenticate, requireRole('landlord'), validate(updateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.bookingRequest.findUnique({ where: { id: req.params.id } });
    if (!booking || booking.landlordId !== req.user!.userId) {
      res.status(404).json({ success: false, message: 'Заявка на бронирование не найдена' });
      return;
    }
    if (booking.status !== 'pending') {
      res.status(400).json({ success: false, message: 'Этот запрос уже был обработан' });
      return;
    }

    const updated = await prisma.bookingRequest.update({
      where: { id: req.params.id },
      data: { status: req.body.status, responseMessage: req.body.responseMessage || null },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id/cancel — renter cancels own request
router.patch('/:id/cancel', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.bookingRequest.findUnique({ where: { id: req.params.id } });
    if (!booking || booking.renterId !== req.user!.userId) {
      res.status(404).json({ success: false, message: 'Заявка на бронирование не найдена' });
      return;
    }
    if (booking.status !== 'pending') {
      res.status(400).json({ success: false, message: 'Можно отменить только ожидающие запросы' });
      return;
    }

    const updated = await prisma.bookingRequest.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
