const { z } = require('zod');

const createBusinessSchema = z.object({
  body: z.object({
    mainCategoryId: z.string().regex(/^\d+$/).nullable().optional(),

    name: z.string().min(3).max(160),

    slug: z
      .string()
      .min(3)
      .max(180)
      .regex(/^[a-z0-9-]+$/),

    shortDescription: z.string().max(500).nullable().optional(),

    description: z.string().nullable().optional(),

    story: z.string().nullable().optional(),

    logoUrl: z.string().max(500).nullable().optional(),

    bannerUrl: z.string().max(500).nullable().optional(),

    contactEmail: z.string().email().nullable().optional(),

    contactPhone: z.string().max(30).nullable().optional(),

    contactWhatsapp: z.string().max(30).nullable().optional(),

    city: z.string().max(120).nullable().optional(),

    department: z.string().max(120).nullable().optional(),

    country: z.string().max(120).nullable().optional(),

    addressText: z.string().max(255).nullable().optional(),

    facebookUrl: z.string().max(500).nullable().optional(),

    instagramUrl: z.string().max(500).nullable().optional(),

    tiktokUrl: z.string().max(500).nullable().optional(),

    websiteUrl: z.string().max(500).nullable().optional(),
  }),
});

const updateBusinessSchema = z.object({
  body: createBusinessSchema.shape.body.partial().extend({
    status: z
      .enum([
        'draft',
        'pending_review',
        'approved',
        'published',
        'rejected',
        'inactive',
        'archived',
      ])
      .optional(),
  }),
});

const listBusinessSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    city: z.string().optional(),
    department: z.string().optional(),
    categoryId: z.string().optional(),
    search: z.string().optional(),
  }),
});

const businessIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
});

const businessSlugParamSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const rejectBusinessSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    rejectionReason: z.string().min(3),
  }),
});

const updateBusinessStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    status: z.enum([
      'draft',
      'pending_review',
      'approved',
      'published',
      'rejected',
      'inactive',
      'archived',
    ]),
  }),
});

module.exports = {
  createBusinessSchema,
  updateBusinessSchema,
  listBusinessSchema,
  businessIdParamSchema,
  businessSlugParamSchema,
  rejectBusinessSchema,
  updateBusinessStatusSchema,
};
