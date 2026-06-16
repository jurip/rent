import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create users
  const renter1 = await prisma.user.create({
    data: {
      email: 'anna@example.com',
      passwordHash,
      fullName: 'Anna Johnson',
      phone: '+1-555-0101',
      role: 'renter',
      emailVerified: true,
    },
  });

  const renter2 = await prisma.user.create({
    data: {
      email: 'james@example.com',
      passwordHash,
      fullName: 'James Wilson',
      phone: '+1-555-0102',
      role: 'renter',
      emailVerified: true,
    },
  });

  const landlord1 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      passwordHash,
      fullName: 'Sarah Williams',
      phone: '+1-555-0103',
      role: 'landlord',
      emailVerified: true,
    },
  });

  const landlord2 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      passwordHash,
      fullName: 'Mike Chen',
      phone: '+1-555-0104',
      role: 'landlord',
      emailVerified: true,
    },
  });

  const properties = [
    {
      title: 'Modern Downtown Loft',
      description: 'Stunning industrial-style loft in the heart of downtown. Features exposed brick walls, high ceilings, and floor-to-ceiling windows with panoramic city views. Recently renovated with premium finishes throughout.',
      price: 3200,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2018,
      floorNumber: 12,
      furnished: true,
      availableDate: new Date('2026-07-01'),
      address: '123 Main Street, Apt 1201',
      city: 'San Francisco',
      neighborhood: 'SoMa',
      latitude: 37.7749,
      longitude: -122.4092,
      amenities: JSON.stringify(['gym', 'parking', 'in-unit-laundry', 'air-conditioning', 'concierge', 'rooftop']),
      landlordId: landlord1.id,
    },
    {
      title: 'Charming Victorian Home',
      description: 'Beautifully restored 1920s Victorian with modern updates. Original hardwood floors, chef\'s kitchen with marble countertops, and a private garden. Perfect for families or professionals seeking character and comfort.',
      price: 4800,
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2100,
      yearBuilt: 1922,
      furnished: false,
      availableDate: new Date('2026-08-01'),
      address: '456 Oak Avenue',
      city: 'San Francisco',
      neighborhood: 'Pacific Heights',
      latitude: 37.7915,
      longitude: -122.4382,
      amenities: JSON.stringify(['garden', 'parking', 'dishwasher', 'storage']),
      landlordId: landlord1.id,
    },
    {
      title: 'Sunset District Studio',
      description: 'Cozy and bright studio apartment just blocks from Ocean Beach. Large windows, freshly painted, and a fully equipped kitchenette. Ideal for students or young professionals.',
      price: 1800,
      propertyType: 'studio',
      bedrooms: 0,
      bathrooms: 1,
      squareFeet: 450,
      yearBuilt: 1965,
      floorNumber: 2,
      furnished: true,
      availableDate: new Date('2026-07-15'),
      address: '789 Irving Street, Apt 4',
      city: 'San Francisco',
      neighborhood: 'Sunset',
      latitude: 37.7639,
      longitude: -122.4933,
      amenities: JSON.stringify(['in-unit-laundry', 'bike-storage']),
      landlordId: landlord1.id,
    },
    {
      title: 'Marina Luxury Condo',
      description: 'High-end waterfront condo with breathtaking views of the Golden Gate Bridge. Top-of-the-line appliances, smart home features, and resort-style building amenities including pool and spa.',
      price: 6500,
      propertyType: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1550,
      yearBuilt: 2022,
      floorNumber: 18,
      furnished: true,
      availableDate: new Date('2026-09-01'),
      address: '100 Marina Boulevard, Apt 1801',
      city: 'San Francisco',
      neighborhood: 'Marina',
      latitude: 37.8044,
      longitude: -122.4383,
      amenities: JSON.stringify(['pool', 'gym', 'parking', 'concierge', 'security', 'air-conditioning', 'balcony']),
      landlordId: landlord2.id,
    },
    {
      title: 'Mission District Flat',
      description: 'Spacious 2-bedroom flat in vibrant Mission District. Walking distance to amazing restaurants, bars, and Dolores Park. Modern kitchen, in-unit washer/dryer, and a shared backyard.',
      price: 3500,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 950,
      yearBuilt: 1940,
      floorNumber: 1,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: '555 Valencia Street',
      city: 'San Francisco',
      neighborhood: 'Mission',
      latitude: 37.7631,
      longitude: -122.4215,
      amenities: JSON.stringify(['in-unit-laundry', 'garden', 'bike-storage', 'dishwasher']),
      landlordId: landlord2.id,
    },
    {
      title: 'Nob Hill Penthouse',
      description: 'Stunning penthouse with 360-degree views of the city and bay. Designer interiors, wrap-around terrace, private elevator access, and a chef\'s kitchen. The ultimate urban living experience.',
      price: 8500,
      propertyType: 'condo',
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2800,
      yearBuilt: 2019,
      floorNumber: 25,
      furnished: true,
      availableDate: new Date('2026-08-15'),
      address: '1 Nob Hill Circle, PH',
      city: 'San Francisco',
      neighborhood: 'Nob Hill',
      latitude: 37.7930,
      longitude: -122.4148,
      amenities: JSON.stringify(['parking', 'gym', 'concierge', 'elevator', 'air-conditioning', 'balcony', 'security', 'rooftop']),
      landlordId: landlord2.id,
    },
    {
      title: 'Bernal Heights Cottage',
      description: 'Charming detached cottage with a private garden and panoramic hill views. Recently updated with eco-friendly materials, solar panels, and a modern kitchen. Quiet neighborhood feel with easy downtown access.',
      price: 3800,
      propertyType: 'house',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 1100,
      yearBuilt: 1935,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: '200 Cortland Avenue',
      city: 'San Francisco',
      neighborhood: 'Bernal Heights',
      latitude: 37.7387,
      longitude: -122.4143,
      amenities: JSON.stringify(['garden', 'parking', 'pet-friendly', 'dishwasher', 'storage']),
      landlordId: landlord2.id,
    },
    {
      title: 'Hayes Valley Modern',
      description: 'Sleek modern apartment in trendy Hayes Valley. Open floor plan, floor-to-ceiling windows, European-style kitchen, and walking distance to the best shopping and dining in the city.',
      price: 4200,
      propertyType: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 780,
      yearBuilt: 2020,
      floorNumber: 8,
      furnished: true,
      availableDate: new Date('2026-08-01'),
      address: '300 Hayes Street, Apt 8B',
      city: 'San Francisco',
      neighborhood: 'Hayes Valley',
      latitude: 37.7765,
      longitude: -122.4238,
      amenities: JSON.stringify(['gym', 'bike-storage', 'air-conditioning', 'elevator', 'concierge']),
      landlordId: landlord1.id,
    },
    {
      title: 'Potrero Hill Townhouse',
      description: 'Beautiful 3-story townhouse with rooftop deck and stunning downtown views. Open-concept main floor, luxurious master suite, attached 2-car garage. Perfect for those who want space and views.',
      price: 7500,
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2400,
      yearBuilt: 2016,
      furnished: false,
      availableDate: new Date('2026-09-15'),
      address: '400 Rhode Island Street',
      city: 'San Francisco',
      neighborhood: 'Potrero Hill',
      latitude: 37.7643,
      longitude: -122.3992,
      amenities: JSON.stringify(['parking', 'rooftop', 'dishwasher', 'air-conditioning', 'storage', 'in-unit-laundry']),
      landlordId: landlord1.id,
    },
    {
      title: 'Richmond District Gem',
      description: 'Spacious and bright 2-bedroom near Golden Gate Park and the Presidio. Quiet residential street, updated bathroom and kitchen, hardwood floors, and abundant natural light throughout.',
      price: 2900,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 900,
      yearBuilt: 1955,
      floorNumber: 2,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: '600 Clement Street, Apt 3',
      city: 'San Francisco',
      neighborhood: 'Richmond',
      latitude: 37.7836,
      longitude: -122.466,
      amenities: JSON.stringify(['in-unit-laundry', 'pet-friendly', 'storage', 'bike-storage']),
      landlordId: landlord1.id,
    },
  ];

  for (const prop of properties) {
    const created = await prisma.property.create({ data: prop });
    await prisma.propertyImage.create({
      data: {
        propertyId: created.id,
        url: `https://placehold.co/1200x800/e2e8f0/64748b?text=${encodeURIComponent(created.title.substring(0, 30))}`,
        thumbnailUrl: `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(created.title.substring(0, 20))}`,
        order: 0,
      },
    });
  }

  console.log(`Seeded ${properties.length} properties`);
  console.log('Seeded 4 users (2 renters, 2 landlords)');
  console.log('Test credentials: anna@example.com / password123 (renter)');
  console.log('Test credentials: sarah@example.com / password123 (landlord)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
