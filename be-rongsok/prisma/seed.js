require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cleanup existing data (optional)
  await prisma.rating.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.orderCollector.deleteMany();
  await prisma.order.deleteMany();
  await prisma.collectorCatalog.deleteMany();
  await prisma.wasteCategory.deleteMany();
  await prisma.collectorProfile.deleteMany();
  await prisma.user.deleteMany();

  // Waste Categories
  const categories = await Promise.all([
    prisma.wasteCategory.create({ data: { name: 'Kardus', iconUrl: 'https://example.com/icons/kardus.png' } }),
    prisma.wasteCategory.create({ data: { name: 'Plastik', iconUrl: 'https://example.com/icons/plastik.png' } }),
    prisma.wasteCategory.create({ data: { name: 'Kertas', iconUrl: 'https://example.com/icons/kertas.png' } })
  ]);

  // Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Rongsok',
      email: 'admin@rongsok.in',
      passwordHash: await bcryptHash('admin123'),
      role: 'ADMIN',
    }
  });

  const collector = await prisma.user.create({
    data: {
      name: 'Pak Budi',
      email: 'budi@collector.com',
      passwordHash: await bcryptHash('collector123'),
      role: 'COLLECTOR',
      location: {
        // Use raw PostGIS value via $queryRaw later – here keep null for simplicity
      }
    }
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Rizky',
      email: 'rizky@example.com',
      passwordHash: await bcryptHash('customer123'),
      role: 'CUSTOMER'
    }
  });

  // Collector Profile
  const profile = await prisma.collectorProfile.create({
    data: {
      userId: collector.id,
      shopName: 'Lapak Budi',
      description: 'Pengepul terpercaya di Yogyakarta',
      radiusKm: 5,
      isOpen: true,
      isPremium: true,
      priorityScore: 10
    }
  });

  // Catalogs for collector
  await Promise.all(categories.map(cat =>
    prisma.collectorCatalog.create({
      data: {
        collectorId: profile.id,
        categoryId: cat.id,
        minPrice: 3000,
        maxPrice: 6000,
        isActive: true
      }
    })
  ));

  console.log('Seed data created successfully');
}

// Helper to hash passwords using bcryptjs
const bcrypt = require('bcryptjs');
async function bcryptHash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
