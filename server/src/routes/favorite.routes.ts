import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db/client.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/favorites/:propertyId
router.post('/:propertyId', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.favorite.findUnique({
      where: { propertyId_userId: { propertyId: req.params.propertyId, userId: req.user!.userId } },
    });
    if (existing) {
      res.json({ success: true, data: existing, message: 'Already in favorites' });
      return;
    }
    const favorite = await prisma.favorite.create({
      data: { propertyId: req.params.propertyId, userId: req.user!.userId },
    });
    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/favorites/:propertyId
router.delete('/:propertyId', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.favorite.deleteMany({
      where: { propertyId: req.params.propertyId, userId: req.user!.userId },
    });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
});

// GET /api/favorites
router.get('/', authenticate, requireRole('renter'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sort = req.query.sort as string;
    const isAvailable = req.query.available as string;

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { property: { price: 'asc' } };
    if (sort === 'price_desc') orderBy = { property: { price: 'desc' } };

    const where: any = { userId: req.user!.userId };
    if (isAvailable === 'true') {
      where.property = { status: 'active' };
    }

    const favorites = await prisma.favorite.findMany({
      where,
      include: {
        property: {
          include: {
            images: { take: 1, orderBy: { order: 'asc' } },
          },
        },
      },
      orderBy,
    });

    res.json({ success: true, data: favorites });
  } catch (error) {
    next(error);
  }
});

export default router;
