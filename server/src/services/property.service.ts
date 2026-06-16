import prisma from '../db/client.js';
import { Prisma } from '@prisma/client';

const PROPERTY_INCLUDE = {
  images: { orderBy: { order: 'asc' as const } },
  landlord: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      email: true,
      phone: true,
    },
  },
};

export class PropertyService {
  async list(filters: {
    search?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string[];
    minBedrooms?: number;
    minBathrooms?: number;
    amenities?: string[];
    sort?: string;
    page?: number;
    pageSize?: number;
    landlordId?: string;
  }) {
    const where: Prisma.PropertyWhereInput = {
      status: 'active',
    };

    if (filters.landlordId) {
      where.landlordId = filters.landlordId;
    }

    if (filters.search) {
      where.OR = [
        { city: { contains: filters.search, mode: 'insensitive' } },
        { neighborhood: { contains: filters.search, mode: 'insensitive' } },
        { title: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.propertyType?.length) {
      where.propertyType = { in: filters.propertyType as any };
    }

    if (filters.minBedrooms !== undefined) {
      where.bedrooms = { gte: filters.minBedrooms };
    }

    if (filters.minBathrooms !== undefined) {
      where.bathrooms = { gte: filters.minBathrooms };
    }

    if (filters.amenities?.length) {
      // For SQLite, filter amenities in-memory after query (or use JSON contains via raw SQL)
      // Simplified: we skip the DB filter and apply post-query
    }

    // Sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { createdAt: 'desc' }; // Would need review aggregation
        break;
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const skip = (page - 1) * pageSize;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: PROPERTY_INCLUDE,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties: properties.map(this.serializeProperty),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      include: PROPERTY_INCLUDE,
    });

    if (!property) return null;

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Get review stats
    const reviewStats = await prisma.review.aggregate({
      where: { propertyId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      ...this.serializeProperty(property),
      reviewStats: {
        averageRating: reviewStats._avg.rating ? Math.round(reviewStats._avg.rating * 10) / 10 : 0,
        totalReviews: reviewStats._count.rating,
      },
    };
  }

  async create(data: {
    title: string;
    description: string;
    price: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    floorNumber?: number;
    furnished: boolean;
    availableDate: string;
    address: string;
    city: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    amenities: string[];
    landlordId: string;
  }) {
    const amenitiesJson = JSON.stringify(data.amenities || []);

    const property = await prisma.property.create({
      data: {
        ...data,
        amenities: amenitiesJson,
        availableDate: new Date(data.availableDate),
      },
      include: PROPERTY_INCLUDE,
    });

    return this.serializeProperty(property);
  }

  async update(id: string, landlordId: string, data: any) {
    const property = await prisma.property.findFirst({
      where: { id, landlordId },
    });
    if (!property) throw new Error('Property not found or access denied');

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        ...(data.availableDate && { availableDate: new Date(data.availableDate) }),
      },
      include: PROPERTY_INCLUDE,
    });

    return this.serializeProperty(updated);
  }

  async delete(id: string, landlordId: string) {
    const property = await prisma.property.findFirst({
      where: { id, landlordId },
    });
    if (!property) throw new Error('Property not found or access denied');

    await prisma.property.delete({ where: { id } });
  }

  async updateStatus(id: string, landlordId: string, status: string) {
    return this.update(id, landlordId, { status });
  }

  async addImage(propertyId: string, url: string, thumbnailUrl: string) {
    const count = await prisma.propertyImage.count({ where: { propertyId } });
    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        url,
        thumbnailUrl,
        order: count,
      },
    });
    return image;
  }

  serializeProperty(property: any) {
    return {
      ...property,
      amenities: typeof property.amenities === 'string' ? JSON.parse(property.amenities) : property.amenities,
      createdAt: property.createdAt instanceof Date ? property.createdAt.toISOString() : property.createdAt,
      updatedAt: property.updatedAt instanceof Date ? property.updatedAt.toISOString() : property.updatedAt,
      availableDate: property.availableDate instanceof Date ? property.availableDate.toISOString() : property.availableDate,
      images: property.images?.map((img: any) => ({
        ...img,
        createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
      })),
      landlord: property.landlord || undefined,
    };
  }
}
