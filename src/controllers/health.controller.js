const { prisma } = require('../config/prisma');
const { env } = require('../config/env');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const health = asyncHandler(async (_req, res) => {
  return successResponse(res, 'API Red Mujeres funcionando correctamente.', {
    status: 'OK',
    service: 'red-mujeres-backend',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const dbHealth = asyncHandler(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  return successResponse(res, 'Conexión a base de datos funcionando correctamente.', {
    status: 'OK',
    database: 'mysql',
    orm: 'prisma',
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  health,
  dbHealth,
};
