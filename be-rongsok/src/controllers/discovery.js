const prisma = require('../config/prisma');

const search = async (req, res, next) => {
  try {
    const { lat, lng, categoryId, radius = 5 } = req.query;

    if (!lat || !lng || !categoryId) {
      return res.status(400).json({ status: 'error', message: 'lat, lng, and categoryId are required' });
    }

    // PostGIS Spatial Query using Prisma $queryRaw
    // ST_DWithin: Checks if points are within radius (meters)
    // ST_Distance: Calculates distance for sorting
    const collectors = await prisma.$queryRaw`
      SELECT 
        cp.id, 
        cp."shopName", 
        cp.description, 
        cp."priorityScore",
        u.name as "ownerName",
        ST_Distance(u.location, ST_SetSRID(ST_MakePoint(${parseFloat(lng)}, ${parseFloat(lat)}), 4326)::geography) as distance
      FROM "CollectorProfile" cp
      JOIN "User" u ON cp."userId" = u.id
      JOIN "CollectorCatalog" cc ON cp.id = cc."collectorId"
      WHERE 
        cc."categoryId" = ${categoryId} AND 
        cc."isActive" = true AND
        cp."isOpen" = true AND
        ST_DWithin(u.location, ST_SetSRID(ST_MakePoint(${parseFloat(lng)}, ${parseFloat(lat)}), 4326)::geography, ${parseFloat(radius)} * 1000)
      ORDER BY cp."isPremium" DESC, distance ASC
    `;

    res.status(200).json({ status: 'success', data: collectors });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.wasteCategory.findMany();
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { search, getCategories };
