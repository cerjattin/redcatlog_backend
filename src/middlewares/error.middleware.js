const { logger } = require('../config/logger');

const errorMiddleware = (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;

  logger.error({
    message: error.message || 'Error interno del servidor',
    statusCode,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    errors: error.errors || null,
  });

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    errors: error.errors || null,
  });
};

module.exports = { errorMiddleware };
