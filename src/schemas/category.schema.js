const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    parentId: z.string().regex(/^\d+$/).nullable().optional(),
    name: z.string().min(2).max(120),
    slug: z
      .string()
      .min(2)
      .max(160)
      .regex(/^[a-z0-9-]+$/),
    description: z.string().nullable().optional(),
    iconUrl: z.string().max(500).nullable().optional(),
    type: z.enum(['business', 'product', 'both']).optional(),
    sortOrder: z.number().int().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial(),
});

const listCategoriesSchema = z.object({
  query: z.object({
    parentId: z.string().optional(),
    type: z.string().optional(),
    isActive: z.string().optional(),
    search: z.string().optional(),
  }),
});

const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
});

const categorySlugParamSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const updateCategoryStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesSchema,
  categoryIdParamSchema,
  categorySlugParamSchema,
  updateCategoryStatusSchema,
};
