const { z } = require('zod');

const idSchema = z.string().regex(/^\d+$/, {
  message: 'El identificador debe ser numérico.',
});

const productStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'published',
  'rejected',
  'inactive',
  'archived',
]);

const createProductSchema = z.object({
  body: z.object({
    entrepreneurId: idSchema,

    categoryId: idSchema.optional().nullable(),

    name: z
      .string()
      .trim()
      .min(2, 'El nombre del producto es obligatorio.')
      .max(160, 'El nombre no puede superar 160 caracteres.'),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .optional(),

    shortDescription: z
      .string()
      .trim()
      .max(500)
      .optional()
      .nullable(),

    description: z
      .string()
      .trim()
      .optional()
      .nullable(),

    price: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    hasPrice: z
      .boolean()
      .optional(),

    stock: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    managesStock: z
      .boolean()
      .optional(),

    status: productStatusSchema.optional(),

    isFeatured: z
      .boolean()
      .optional(),

    featuredOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    entrepreneurId: idSchema.optional(),

    categoryId: idSchema.optional().nullable(),

    name: z
      .string()
      .trim()
      .min(2)
      .max(160)
      .optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(180)
      .optional(),

    shortDescription: z
      .string()
      .trim()
      .max(500)
      .optional()
      .nullable(),

    description: z
      .string()
      .trim()
      .optional()
      .nullable(),

    price: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    hasPrice: z
      .boolean()
      .optional(),

    stock: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    managesStock: z
      .boolean()
      .optional(),

    status: productStatusSchema.optional(),

    isFeatured: z
      .boolean()
      .optional(),

    featuredOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),
  }),
});

const productIdParamSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

const productSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(2),
  }),
});

const listProductsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/)
      .optional(),

    limit: z
      .string()
      .regex(/^\d+$/)
      .optional(),

    status: productStatusSchema.optional(),

    entrepreneurId: idSchema.optional(),

    categoryId: idSchema.optional(),

    search: z.string().trim().optional(),

    isFeatured: z
      .enum(['true', 'false'])
      .optional(),
  }),
});

const updateProductStatusSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    status: productStatusSchema,
  }),
});

const rejectProductSchema = z.object({
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

const updateFeaturedProductSchema = z.object({
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

const productImageIdParamSchema = z.object({
  params: z.object({
    id: idSchema,
    imageId: idSchema,
  }),
});

const addProductImageSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
  body: z.object({
    imageUrl: z
      .string()
      .trim()
      .min(3, 'La URL de la imagen es obligatoria.'),

    altText: z
      .string()
      .trim()
      .max(180)
      .optional()
      .nullable(),

    sortOrder: z
      .union([z.string(), z.number()])
      .optional()
      .nullable(),

    isMain: z
      .boolean()
      .optional(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productSlugParamSchema,
  listProductsQuerySchema,
  updateProductStatusSchema,
  rejectProductSchema,
  updateFeaturedProductSchema,
  addProductImageSchema,
  productImageIdParamSchema,
};