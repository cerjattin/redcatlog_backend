const app = require('./app');
const { prisma } = require('./config/prisma');
const { env } = require('./config/env');
const { logger } = require('./config/logger');

const server = app.listen(env.PORT, () => {
  logger.info(`Servidor Red Mujeres iniciado en puerto ${env.PORT}`);
});

const gracefulShutdown = async (signal) => {
  logger.warn(`Señal ${signal} recibida. Cerrando servidor...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();

      logger.info('Prisma desconectado correctamente.');

      logger.info('Servidor detenido correctamente.');

      process.exit(0);
    } catch (error) {
      logger.error({
        message: 'Error durante shutdown.',
        error: error.message,
        stack: error.stack,
      });

      process.exit(1);
    }
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', async (error) => {
  logger.error({
    message: 'Uncaught Exception',
    error: error.message,
    stack: error.stack,
  });

  try {
    await prisma.$disconnect();
  } finally {
    process.exit(1);
  }
});

process.on('unhandledRejection', async (reason) => {
  logger.error({
    message: 'Unhandled Promise Rejection',
    reason,
  });

  try {
    await prisma.$disconnect();
  } finally {
    process.exit(1);
  }
});
