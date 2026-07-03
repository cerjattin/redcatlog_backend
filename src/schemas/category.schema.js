const { z } = require('zod');

const idSchema = z.string().regex(/^\d+$/, {
  message: 'El identificador debe ser numérico.',
});

const categoryTypeSchema = z.enum(['entrepreneur', 'product', 'both']);

const createCategorySchema = z.object({
  body: z.object({
    parentId: idSchema.nullable().optional(),

    name: z
      .string()
      .trim()
      .min(2, 'El nombre de la categoría es obligatorio.')
      .max(120),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(160)
      .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones.')
      .optional(),

    description: z.string().trim().nullable().optional(),

    iconUrl: z
      .string()
      .trim()
      .max(500)
      .nullable()
      .optional(),

    type: categoryTypeSchema.optional(),

    sortOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    isActive: z.boolean().optional(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: createCategorySchema.shape.body.partial(),
});

const listCategoriesSchema = z.object({
  query: z.object({
    parentId: z.string().optional(),
    type: categoryTypeSchema.optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().trim().optional(),
  }),
});

const categoryIdParamSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

const categorySlugParamSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(2),
  }),
});

const updateCategoryStatusSchema = z.object({
  params: z.object({
    id: idSchema,
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