import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Заполнение базы данных...');

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
      fullName: 'Анна Смирнова',
      phone: '+1-555-0101',
      role: 'renter',
      emailVerified: true,
    },
  });

  const renter2 = await prisma.user.create({
    data: {
      email: 'james@example.com',
      passwordHash,
      fullName: 'Дмитрий Петров',
      phone: '+1-555-0102',
      role: 'renter',
      emailVerified: true,
    },
  });

  const landlord1 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      passwordHash,
      fullName: 'Елена Кузнецова',
      phone: '+1-555-0103',
      role: 'landlord',
      emailVerified: true,
    },
  });

  const landlord2 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      passwordHash,
      fullName: 'Алексей Иванов',
      phone: '+1-555-0104',
      role: 'landlord',
      emailVerified: true,
    },
  });

  const properties = [
    {
      title: 'Современный лофт в центре',
      description: 'Потрясающий лофт в индустриальном стиле в самом центре города. Кирпичные стены, высокие потолки и панорамные окна от пола до потолка с видом на город. Недавно обновлён с премиальной отделкой.',
      price: 3200,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      yearBuilt: 2018,
      floorNumber: 12,
      furnished: true,
      availableDate: new Date('2026-07-01'),
      address: 'ул. Тверская, д. 123, кв. 1201',
      city: 'Москва',
      neighborhood: 'Тверской',
      latitude: 37.7749,
      longitude: -122.4092,
      amenities: JSON.stringify(['gym', 'parking', 'in-unit-laundry', 'air-conditioning', 'concierge', 'rooftop']),
      landlordId: landlord1.id,
    },
    {
      title: 'Уютный дом в сталинском стиле',
      description: 'Прекрасно отреставрированный дом 1920-х годов с современными обновлениями. Оригинальные деревянные полы, кухня с мраморными столешницами и собственный сад. Идеально для семей или профессионалов, ценящих характер и комфорт.',
      price: 4800,
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2100,
      yearBuilt: 1922,
      furnished: false,
      availableDate: new Date('2026-08-01'),
      address: 'Ленинский проспект, д. 45',
      city: 'Москва',
      neighborhood: 'Хамовники',
      latitude: 37.7915,
      longitude: -122.4382,
      amenities: JSON.stringify(['garden', 'parking', 'dishwasher', 'storage']),
      landlordId: landlord1.id,
    },
    {
      title: 'Уютная студия у парка',
      description: 'Уютная и светлая студия в нескольких минутах от парка. Большие окна, свежий ремонт и полностью оборудованная мини-кухня. Идеально для студентов или молодых специалистов.',
      price: 1800,
      propertyType: 'studio',
      bedrooms: 0,
      bathrooms: 1,
      squareFeet: 450,
      yearBuilt: 1965,
      floorNumber: 2,
      furnished: true,
      availableDate: new Date('2026-07-15'),
      address: 'ул. Профсоюзная, д. 78, кв. 4',
      city: 'Москва',
      neighborhood: 'Черёмушки',
      latitude: 37.7639,
      longitude: -122.4933,
      amenities: JSON.stringify(['in-unit-laundry', 'bike-storage']),
      landlordId: landlord1.id,
    },
    {
      title: 'Роскошный кондоминиум с видом на реку',
      description: 'Элитный кондоминиум с захватывающим видом на Москву-реку. Техника премиум-класса, умный дом и удобства курортного уровня, включая бассейн и спа.',
      price: 6500,
      propertyType: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1550,
      yearBuilt: 2022,
      floorNumber: 18,
      furnished: true,
      availableDate: new Date('2026-09-01'),
      address: 'Пресненская набережная, д. 10, кв. 1801',
      city: 'Москва',
      neighborhood: 'Москва-Сити',
      latitude: 37.8044,
      longitude: -122.4383,
      amenities: JSON.stringify(['pool', 'gym', 'parking', 'concierge', 'security', 'air-conditioning', 'balcony']),
      landlordId: landlord2.id,
    },
    {
      title: 'Просторная квартира в центре',
      description: 'Просторная 2-комнатная квартира в оживлённом районе. В пешей доступности отличные рестораны, бары и парки. Современная кухня, стиральная машина и общий двор.',
      price: 3500,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 950,
      yearBuilt: 1940,
      floorNumber: 1,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: 'ул. Арбат, д. 55',
      city: 'Москва',
      neighborhood: 'Арбат',
      latitude: 37.7631,
      longitude: -122.4215,
      amenities: JSON.stringify(['in-unit-laundry', 'garden', 'bike-storage', 'dishwasher']),
      landlordId: landlord2.id,
    },
    {
      title: 'Пентхаус с панорамным видом',
      description: 'Потрясающий пентхаус с панорамным видом на 360 градусов. Дизайнерский интерьер, просторная терраса, приватный лифт и кухня для шеф-повара. Идеальное городское жильё.',
      price: 8500,
      propertyType: 'condo',
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2800,
      yearBuilt: 2019,
      floorNumber: 25,
      furnished: true,
      availableDate: new Date('2026-08-15'),
      address: 'Кутузовский проспект, д. 1, пентхаус',
      city: 'Москва',
      neighborhood: 'Дорогомилово',
      latitude: 37.7930,
      longitude: -122.4148,
      amenities: JSON.stringify(['parking', 'gym', 'concierge', 'elevator', 'air-conditioning', 'balcony', 'security', 'rooftop']),
      landlordId: landlord2.id,
    },
    {
      title: 'Коттедж с садом в тихом районе',
      description: 'Очаровательный отдельный коттедж с частным садом и панорамным видом. Недавно обновлён с использованием экологичных материалов, солнечных панелей и современной кухни. Тихий район с лёгким доступом к центру.',
      price: 3800,
      propertyType: 'house',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 1100,
      yearBuilt: 1935,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: 'Рублёвское шоссе, д. 20',
      city: 'Москва',
      neighborhood: 'Крылатское',
      latitude: 37.7387,
      longitude: -122.4143,
      amenities: JSON.stringify(['garden', 'parking', 'pet-friendly', 'dishwasher', 'storage']),
      landlordId: landlord2.id,
    },
    {
      title: 'Современная квартира в новостройке',
      description: 'Стильная современная квартира в модном районе. Открытая планировка, окна в пол, кухня в европейском стиле и пешая доступность до лучших магазинов и ресторанов города.',
      price: 4200,
      propertyType: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 780,
      yearBuilt: 2020,
      floorNumber: 8,
      furnished: true,
      availableDate: new Date('2026-08-01'),
      address: 'ул. Большая Дмитровка, д. 30, кв. 8Б',
      city: 'Москва',
      neighborhood: 'Пресненский',
      latitude: 37.7765,
      longitude: -122.4238,
      amenities: JSON.stringify(['gym', 'bike-storage', 'air-conditioning', 'elevator', 'concierge']),
      landlordId: landlord1.id,
    },
    {
      title: 'Трёхэтажный таунхаус с террасой',
      description: 'Прекрасный 3-этажный таунхаус с террасой на крыше и потрясающим видом на центр. Открытая планировка первого этажа, роскошная хозяйская спальня, гараж на 2 машины. Идеально для тех, кто ценит пространство и вид.',
      price: 7500,
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 2400,
      yearBuilt: 2016,
      furnished: false,
      availableDate: new Date('2026-09-15'),
      address: 'ул. Мосфильмовская, д. 40',
      city: 'Москва',
      neighborhood: 'Раменки',
      latitude: 37.7643,
      longitude: -122.3992,
      amenities: JSON.stringify(['parking', 'rooftop', 'dishwasher', 'air-conditioning', 'storage', 'in-unit-laundry']),
      landlordId: landlord1.id,
    },
    {
      title: 'Светлая квартира у парка',
      description: 'Просторная и светлая 2-комнатная квартира рядом с парком. Тихая улица, обновлённые ванная и кухня, деревянные полы и обилие естественного света.',
      price: 2900,
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 900,
      yearBuilt: 1955,
      floorNumber: 2,
      furnished: false,
      availableDate: new Date('2026-07-01'),
      address: 'ул. Удальцова, д. 60, кв. 3',
      city: 'Москва',
      neighborhood: 'Проспект Вернадского',
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

  console.log(`Добавлено ${properties.length} объектов`);
  console.log('Добавлено 4 пользователя (2 арендатора, 2 арендодателя)');
  console.log('Тестовые данные: anna@example.com / password123 (арендатор)');
  console.log('Тестовые данные: sarah@example.com / password123 (арендодатель)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
