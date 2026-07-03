const { z } = require('zod');

const idSchema = z.string().regex(/^\d+$/, {
  message: 'El identificador debe ser numérico.',
});

const entrepreneurStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'rejected',
  'inactive',
]);

const nullableString = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable();

const createEntrepreneurSchema = z.object({
  body: z.object({
    userId: idSchema.optional().nullable(),
    categoryId: idSchema.optional().nullable(),

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

    slug: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones.')
      .optional(),

    photoUrl: nullableString(500),
    bannerUrl: nullableString(500),

    email: nullableString(180),
    phone: nullableString(30),
    whatsapp: nullableString(30),

    facebookUrl: nullableString(500),
    instagramUrl: nullableString(500),
    tiktokUrl: nullableString(500),
    youtubeUrl: nullableString(500),
    websiteUrl: nullableString(500),

    documentType: nullableString(30),
    documentNumber: nullableString(50),

    personalStory: z.string().trim().optional().nullable(),
    shortBio: nullableString(500),
    locationText: nullableString(255),

    city: nullableString(120),
    department: nullableString(120),
    country: nullableString(120),

    status: entrepreneurStatusSchema.optional(),

    isFeatured: z.boolean().optional(),

    featuredOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),
  }),
});

const updateEntrepreneurSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: createEntrepreneurSchema.shape.body.partial(),
});

const listEntrepreneursSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),

    status: entrepreneurStatusSchema.optional(),

    categoryId: idSchema.optional(),

    city: z.string().trim().optional(),
    department: z.string().trim().optional(),
    search: z.string().trim().optional(),

    isFeatured: z.enum(['true', 'false']).optional(),
  }),
});

const entrepreneurIdParamSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

const entrepreneurSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(2),
  }),
});

const rejectEntrepreneurSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(3, 'Debes indicar el motivo del rechazo.')
      .max(1000),
  }),
});

const updateEntrepreneurStatusSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    status: entrepreneurStatusSchema,
  }),
});

const updateFeaturedEntrepreneurSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    isFeatured: z.boolean(),
    featuredOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),
  }),
});

module.exports = {
  createEntrepreneurSchema,
  updateEntrepreneurSchema,
  listEntrepreneursSchema,
  entrepreneurIdParamSchema,
  entrepreneurSlugParamSchema,
  rejectEntrepreneurSchema,
  updateEntrepreneurStatusSchema,
  updateFeaturedEntrepreneurSchema,
};