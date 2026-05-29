const { z } = require('zod');

const updateMeSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(100).optional(),
    lastName: z.string().min(2).max(100).optional(),
    phone: z.string().max(30).nullable().optional(),
    whatsapp: z.string().max(30).nullable().optional(),
    profilePhotoUrl: z.string().max(500).nullable().optional(),
    bio: z.string().nullable().optional(),
    city: z.string().max(120).nullable().optional(),
    department: z.string().max(120).nullable().optional(),
    country: z.string().max(120).nullable().optional(),
  }),
});

const listUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    role: z.string().optional(),
    search: z.string().optional(),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
});

const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
  body: z.object({
    status: z.enum(['pending', 'active', 'inactive', 'blocked', 'deleted']),
  }),
});

module.exports = {
  updateMeSchema,
  listUsersSchema,
  userIdParamSchema,
  updateUserStatusSchema,
};
