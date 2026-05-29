const { z } = require('zod');

const createPageSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(180),
    slug: z
      .string()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9-]+$/),
    metaTitle: z.string().max(180).nullable().optional(),
    metaDescription: z.string().max(255).nullable().optional(),
    status: z.enum(['draft', 'published', 'inactive', 'archived']).optional(),
    publishedAt: z.string().datetime().nullable().optional(),
  }),
});

const updatePageSchema = z.object({
  body: createPageSchema.shape.body.partial(),
});

const createSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    sectionKey: z.string().min(2).max(100),
    title: z.string().max(180).nullable().optional(),
    subtitle: z.string().max(255).nullable().optional(),
    content: z.string().nullable().optional(),
    imageUrl: z.string().max(500).nullable().optional(),
    buttonLabel: z.string().max(120).nullable().optional(),
    buttonUrl: z.string().max(500).nullable().optional(),
    sortOrder: z.number().int().optional(),
    status: z.enum(['draft', 'published', 'inactive', 'archived']).optional(),
  }),
});

const updateSectionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: createSectionSchema.shape.body.partial(),
});

const pageIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const sectionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const pageSlugParamSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

module.exports = {
  createPageSchema,
  updatePageSchema,
  createSectionSchema,
  updateSectionSchema,
  pageIdParamSchema,
  sectionIdParamSchema,
  pageSlugParamSchema,
};
