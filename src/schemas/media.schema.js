const { z } = require('zod');

const createMediaFileSchema = z.object({
  body: z.object({
    fileUrl: z.string().min(3),
    fileType: z.enum(['image', 'video', 'document', 'other']).optional(),
    mimeType: z.string().nullable().optional(),
    originalName: z.string().nullable().optional(),
    altText: z.string().nullable().optional(),
  }),
});

const createGallerySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(160),
    slug: z
      .string()
      .min(2)
      .max(180)
      .regex(/^[a-z0-9-]+$/),
    description: z.string().nullable().optional(),
    locationKey: z.string().max(100).nullable().optional(),
    status: z.enum(['draft', 'published', 'inactive', 'archived']).optional(),
    sortOrder: z.number().int().optional(),
  }),
});

const updateGallerySchema = z.object({
  body: createGallerySchema.shape.body.partial(),
});

const galleryIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const gallerySlugParamSchema = z.object({
  params: z.object({
    slug: z.string(),
  }),
});

const mediaFileIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const addGalleryItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),

  body: z.object({
    mediaFileId: z.string().regex(/^\d+$/),

    title: z.string().nullable().optional(),

    caption: z.string().nullable().optional(),

    sortOrder: z.number().int().optional(),
  }),
});

const deleteGalleryItemSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),

    itemId: z.string().regex(/^\d+$/),
  }),
});

module.exports = {
  createMediaFileSchema,
  createGallerySchema,
  updateGallerySchema,
  galleryIdParamSchema,
  gallerySlugParamSchema,
  mediaFileIdParamSchema,
  addGalleryItemSchema,
  deleteGalleryItemSchema,
};
