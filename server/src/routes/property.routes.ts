import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PropertyService } from '../services/property.service.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();
const propertyService = new PropertyService();

const createPropertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive(),
  propertyType: z.enum(['apartment', 'house', 'condo', 'studio']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(1),
  squareFeet: z.number().int().min(1),
  yearBuilt: z.number().int().optional(),
  floorNumber: z.number().int().optional(),
  furnished: z.boolean(),
  availableDate: z.string(),
  address: z.string().min(5),
  city: z.string().min(1),
  neighborhood: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  amenities: z.array(z.string()),
});

// GET /api/properties
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      search: req.query.search as string | undefined,
      city: req.query.city as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      propertyType: req.query.propertyType ? (req.query.propertyType as string).split(',') : undefined,
      minBedrooms: req.query.minBedrooms ? Number(req.query.minBedrooms) : undefined,
      minBathrooms: req.query.minBathrooms ? Number(req.query.minBathrooms) : undefined,
      amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
      sort: req.query.sort as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };
    const result = await propertyService.list(filters);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/properties/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertyService.getById(req.params.id);
    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
});

// POST /api/properties (landlord only)
router.post('/', authenticate, requireRole('landlord'), validate(createPropertySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertyService.create({
      ...req.body,
      landlordId: req.user!.userId,
    });
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/properties/:id (landlord only)
router.patch('/:id', authenticate, requireRole('landlord'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await propertyService.update(req.params.id, req.user!.userId, req.body);
    res.json({ success: true, data: property });
  } catch (error: any) {
    next(error);
  }
});

// DELETE /api/properties/:id (landlord only)
router.delete('/:id', authenticate, requireRole('landlord'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await propertyService.delete(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Property deleted' });
  } catch (error: any) {
    next(error);
  }
});

// GET /api/properties/landlord/mine
router.get('/landlord/mine', authenticate, requireRole('landlord'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await propertyService.list({ landlordId: req.user!.userId, pageSize: 100 });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Error handler
router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Property route error:', err);
  const status = (err as any).statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Internal server error' });
});

export default router;
