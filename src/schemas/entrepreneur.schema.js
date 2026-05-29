const { z } = require('zod');

const createEntrepreneurSchema = z.object({
  body: z.object({
    documentType: z.string().max(30).nullable().optional(),
    documentNumber: z.string().max(50).nullable().optional(),
    personalStory: z.string().nullable().optional(),
    shortBio: z.string().max(500).nullable().optional(),
    locationText: z.string().max(255).nullable().optional(),
    city: z.string().max(120).nullable().optional(),
    department: z.string().max(120).nullable().optional(),
    country: z.string().max(120).nullable().optional(),
  }),
});

const updateEntrepreneurSchema = z.object({
  body: z.object({
    documentType: z.string().max(30).nullable().optional(),
    documentNumber: z.string().max(50).nullable().optional(),
    personalStory: z.string().nullable().optional(),
    shortBio: z.string().max(500).nullable().optional(),
    locationText: z.string().max(255).nullable().optional(),
    city: z.string().max(120).nullable().optional(),
    department: z.string().max(120).nullable().optional(),
    country: z.string().max(120).nullable().optional(),
    status: z.enum(['draft', 'pending_review']).optional(),
  }),
});

const listEntrepreneursSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
    city: z.string().optional(),
    department: z.string().optional(),
    search: z.string().optional(),
  }),
});

const entrepreneurIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
});

const rejectEntrepreneurSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
  body: z.object({
    rejectionReason: z.string().min(3),
  }),
});

const updateEntrepreneurStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'El id debe ser numérico.'),
  }),
  body: z.object({
    status: z.enum(['draft', 'pending_review', 'approved', 'rejected', 'inactive']),
  }),
});

module.exports = {
  createEntrepreneurSchema,
  updateEntrepreneurSchema,
  listEntrepreneursSchema,
  entrepreneurIdParamSchema,
  rejectEntrepreneurSchema,
  updateEntrepreneurStatusSchema,
};
