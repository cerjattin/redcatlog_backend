const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { env } = require('../config/env');

const helmetMiddleware = helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },
});

const compressionMiddleware = compression();

const hppMiddleware = hpp();

const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
  },
});

const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación. Intenta nuevamente más tarde.',
  },
});

module.exports = {
  helmetMiddleware,
  compressionMiddleware,
  hppMiddleware,
  apiRateLimiter,
  authRateLimiter,
};
