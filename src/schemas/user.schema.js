const { z } = require('zod');

const idSchema = z.string().regex(/^\d+$/, {
  message: 'El identificador debe ser numérico.',
});

const userStatusSchema = z.enum(['pending', 'active', 'inactive', 'blocked', 'deleted']);

const systemRoleSchema = z.enum(['admin', 'editor']);

const createUserSchema = z.object({
  body: z.object({
    role: systemRoleSchema.default('editor'),

    firstName: z
      .string()
      .trim()
      .min(2, 'El nombre es obligatorio.')
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(2, 'El apellido es obligatorio.')
      .max(100),

    email: z
      .string()
      .trim()
      .email('Correo inválido.')
      .max(180),

    password: z
      .string()
      .min(8, 'La contraseña debe tener mínimo 8 caracteres.'),

    phone: z.string().trim().max(30).optional().nullable(),
    whatsapp: z.string().trim().max(30).optional().nullable(),
    profilePhotoUrl: z.string().trim().max(500).optional().nullable(),
    bio: z.string().trim().optional().nullable(),
    city: z.string().trim().max(120).optional().nullable(),
    department: z.string().trim().max(120).optional().nullable(),
    country: z.string().trim().max(120).optional().nullable(),

    status: userStatusSchema.optional(),
  }),
});

const updateMeSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(100).optional(),
    lastName: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().max(30).nullable().optional(),
    whatsapp: z.string().trim().max(30).nullable().optional(),
    profilePhotoUrl: z.string().trim().max(500).nullable().optional(),
    bio: z.string().trim().nullable().optional(),
    city: z.string().trim().max(120).nullable().optional(),
    department: z.string().trim().max(120).nullable().optional(),
    country: z.string().trim().max(120).nullable().optional(),
  }),
});

const listUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: userStatusSchema.optional(),
    role: systemRoleSchema.optional(),
    search: z.string().trim().optional(),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

const updateUserStatusSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    status: userStatusSchema,
  }),
});

module.exports = {
  createUserSchema,
  updateMeSchema,
  listUsersSchema,
  userIdParamSchema,
  updateUserStatusSchema,
};