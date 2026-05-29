const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    businessId: z.string().regex(/^\d+$/),
    categoryId: z.string().regex(/^\d+$/).nullable().optional(),
    name: z.string().min(3).max(160),
    slug: z
      .string()
      .min(3)
      .max(180)
      .regex(/^[a-z0-9-]+$/),
    shortDescription: z.string().max(500).nullable().optional(),
    description: z.string().nullable().optional(),
    price: z.number().nullable().optional(),
    hasPrice: z.boolean().optional(),
    stock: z.number().int().nullable().optional(),
    managesStock: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial().extend({
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

const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    businessId: z.string().optional(),
    categoryId: z.string().optional(),
    search: z.string().optional(),
  }),
});

const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
});

const productSlugParamSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const rejectProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    rejectionReason: z.string().min(3),
  }),
});

const updateProductStatusSchema = z.object({
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

const addProductImageSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),

  body: z.object({
    imageUrl: z.string().min(3),

    altText: z.string().max(180).nullable().optional(),

    sortOrder: z.number().int().optional(),

    isMain: z.boolean().optional(),
  }),
});

const deleteProductImageSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),

    imageId: z.string().regex(/^\d+$/),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  productIdParamSchema,
  productSlugParamSchema,
  rejectProductSchema,
  updateProductStatusSchema,
  addProductImageSchema,
  deleteProductImageSchema,
};
