const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().email().max(180),
    password: z.string().min(8).max(100),
    phone: z.string().max(30).optional(),
    whatsapp: z.string().max(30).optional(),
    city: z.string().max(120).optional(),
    department: z.string().max(120).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
};
