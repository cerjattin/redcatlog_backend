require('dotenv').config();

const { cleanEnv, str, port, num } = require('envalid');

const parseCorsOrigins = (value) => {
  if (!value) return ['http://localhost:3000'];

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const validatedEnv = cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'test', 'production'],
  }),

  PORT: port({
    default: 4000,
  }),

  DATABASE_URL: str(),

  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),

  JWT_ACCESS_EXPIRES_IN: str({
    default: '15m',
  }),

  JWT_REFRESH_EXPIRES_IN: str({
    default: '7d',
  }),

  CORS_ORIGINS: str({
    default: 'http://localhost:3000,http://localhost:5173,http://localhost:4000',
  }),

  UPLOADS_DIR: str({
    default: 'src/uploads',
  }),

  MAX_FILE_SIZE_MB: num({
    default: 3,
  }),

  RATE_LIMIT_WINDOW_MINUTES: num({
    default: 15,
  }),

  RATE_LIMIT_MAX_REQUESTS: num({
    default: 300,
  }),

  AUTH_RATE_LIMIT_MAX_REQUESTS: num({
    default: 20,
  }),
});

const env = {
  NODE_ENV: validatedEnv.NODE_ENV,
  PORT: validatedEnv.PORT,
  DATABASE_URL: validatedEnv.DATABASE_URL,

  JWT_ACCESS_SECRET: validatedEnv.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: validatedEnv.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: validatedEnv.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN: validatedEnv.JWT_REFRESH_EXPIRES_IN,

  CORS_ORIGINS: parseCorsOrigins(validatedEnv.CORS_ORIGINS),
  UPLOADS_DIR: validatedEnv.UPLOADS_DIR,
  MAX_FILE_SIZE_MB: validatedEnv.MAX_FILE_SIZE_MB,

  RATE_LIMIT_WINDOW_MINUTES: validatedEnv.RATE_LIMIT_WINDOW_MINUTES,
  RATE_LIMIT_MAX_REQUESTS: validatedEnv.RATE_LIMIT_MAX_REQUESTS,
  AUTH_RATE_LIMIT_MAX_REQUESTS: validatedEnv.AUTH_RATE_LIMIT_MAX_REQUESTS,
};

module.exports = { env };
