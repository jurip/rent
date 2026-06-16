import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../db/client.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

const createSchema = z.object({
  propertyId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10),
});

const responseSchema = z.object({
  message: z.string().min(1),
});

// POST /api/reviews
router.post('/', authenticate, requireRole('renter'), validate(createSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Check renter has an accepted booking for this property
    const booking = await prisma.bookingRequest.findFirst({
      where: { propertyId, renterId: req.user!.userId, status: 'accepted' },
    });
    if (!booking) {
      res.status(403).json({ success: false, message: 'Only verified renters can leave a review' });
      return;
    }

    // Check for duplicate
    const existing = await prisma.review.findUnique({
      where: { propertyId_renterId: { propertyId, renterId: req.user!.userId } },
    });
    if (existing) {
      res.status(400).json({ success: false, message: 'You have already reviewed this property. You can edit your existing review.' });
      return;
    }

    const review = await prisma.review.create({
      data: { propertyId, renterId: req.user!.userId, rating, comment },
      include: { renter: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reviews/:id
router.patch('/:id', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review || review.renterId !== req.user!.userId) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { ...req.body, edited: true },
      include: { renter: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review || review.renterId !== req.user!.userId) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:id/response (landlord)
router.post('/:id/response', authenticate, requireRole('landlord'), validate(responseSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: { property: { select: { landlordId: true } } },
    });
    if (!review || review.property.landlordId !== req.user!.userId) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: { landlordResponse: req.body.message, landlordResponseAt: new Date() },
      include: { renter: { select: { id: true, fullName: true, avatarUrl: true } } },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:id/report
router.post('/:id/report', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In production: save report to DB, notify admins
    // For now, just acknowledge
    res.json({ success: true, message: 'Thank you for your report. We will review this content.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews?propertyId=...
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const propertyId = req.query.propertyId as string;
    if (!propertyId) {
      res.status(400).json({ success: false, message: 'propertyId is required' });
      return;
    }

    const sort = req.query.sort as string;
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'highest') orderBy = { rating: 'desc' };
    if (sort === 'lowest') orderBy = { rating: 'asc' };

    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: { renter: { select: { id: true, fullName: true, avatarUrl: true } } },
      orderBy,
    });

    const aggregate = await prisma.review.aggregate({
      where: { propertyId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: aggregate._avg.rating ? Math.round(aggregate._avg.rating * 10) / 10 : 0,
        totalReviews: aggregate._count.rating,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
