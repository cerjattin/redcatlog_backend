const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');

const entrepreneurRepository = require('../repositories/entrepreneur.repository');
const approvalRepository = require('../repositories/approval.repository');
const auditRepository = require('../repositories/audit.repository');

const ADMIN_VISIBLE_STATUSES = [
  'draft',
  'pending_review',
  'approved',
  'rejected',
  'inactive',
];

const generateSlug = (text) => {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
};

const jsonOrNull = (value) => {
  if (value === undefined || value === null) return null;

  try {
    return JSON.stringify(value);
  } catch (_error) {
    return null;
  }
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: toStringId(user.id),
    roleId: toStringId(user.roleId),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    whatsapp: user.whatsapp,
    profilePhotoUrl: user.profilePhotoUrl,
    bio: user.bio,
    city: user.city,
    department: user.department,
    country: user.country,
    status: user.status,
    role: user.role
      ? {
          id: toStringId(user.role.id),
          name: user.role.name,
          description: user.role.description,
        }
      : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const normalizeCategory = (category) => {
  if (!category) return null;

  return {
    id: toStringId(category.id),
    parentId: toStringId(category.parentId),
    name: category.name,
    slug: category.slug,
    description: category.description,
    iconUrl: category.iconUrl,
    type: category.type,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  };
};

const normalizeProductImage = (image) => {
  if (!image) return null;

  return {
    id: toStringId(image.id),
    productId: toStringId(image.productId),
    imageUrl: image.imageUrl,
    altText: image.altText,
    sortOrder: image.sortOrder,
    isMain: image.isMain,
  };
};

const normalizeProductSummary = (product) => {
  if (!product) return null;

  return {
    id: toStringId(product.id),
    entrepreneurId: toStringId(product.entrepreneurId),
    categoryId: toStringId(product.categoryId),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    price: product.price !== null && product.price !== undefined ? product.price.toString() : null,
    hasPrice: product.hasPrice,
    stock: product.stock,
    managesStock: product.managesStock,
    status: product.status,
    isFeatured: product.isFeatured,
    featuredOrder: product.featuredOrder,
    category: normalizeCategory(product.category),
    images: Array.isArray(product.images)
      ? product.images.map(normalizeProductImage)
      : [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const normalizeEntrepreneur = (entrepreneur) => {
  if (!entrepreneur) return null;

  return {
    id: toStringId(entrepreneur.id),
    userId: toStringId(entrepreneur.userId),
    categoryId: toStringId(entrepreneur.categoryId),

    firstName: entrepreneur.firstName,
    lastName: entrepreneur.lastName,
    fullName: `${entrepreneur.firstName || ''} ${entrepreneur.lastName || ''}`.trim(),

    slug: entrepreneur.slug,
    photoUrl: entrepreneur.photoUrl,
    bannerUrl: entrepreneur.bannerUrl,

    email: entrepreneur.email,
    phone: entrepreneur.phone,
    whatsapp: entrepreneur.whatsapp,

    facebookUrl: entrepreneur.facebookUrl,
    instagramUrl: entrepreneur.instagramUrl,
    tiktokUrl: entrepreneur.tiktokUrl,
    youtubeUrl: entrepreneur.youtubeUrl,
    websiteUrl: entrepreneur.websiteUrl,

    documentType: entrepreneur.documentType,
    documentNumber: entrepreneur.documentNumber,

    personalStory: entrepreneur.personalStory,
    shortBio: entrepreneur.shortBio,
    locationText: entrepreneur.locationText,
    city: entrepreneur.city,
    department: entrepreneur.department,
    country: entrepreneur.country,

    status: entrepreneur.status,

    isFeatured: entrepreneur.isFeatured,
    featuredOrder: entrepreneur.featuredOrder,

    approvedAt: entrepreneur.approvedAt,
    approvedBy: toStringId(entrepreneur.approvedBy),
    rejectedAt: entrepreneur.rejectedAt,
    rejectionReason: entrepreneur.rejectionReason,

    user: normalizeUser(entrepreneur.user),
    category: normalizeCategory(entrepreneur.category),
    approvedByUser: normalizeUser(entrepreneur.approvedByUser),

    products: Array.isArray(entrepreneur.products)
      ? entrepreneur.products.map(normalizeProductSummary)
      : [],

    createdAt: entrepreneur.createdAt,
    updatedAt: entrepreneur.updatedAt,
  };
};

const normalizePagination = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const ensureUniqueSlug = async (baseSlug, currentId = null) => {
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await entrepreneurRepository.findEntrepreneurBySlug(slug);

    if (!existing) return slug;

    if (currentId && existing.id.toString() === currentId.toString()) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const cleanEntrepreneurPayload = async (payload, currentId = null) => {
  const data = {};

  if (payload.userId !== undefined) {
    data.userId = payload.userId ? BigInt(payload.userId) : null;
  }

  if (payload.categoryId !== undefined) {
    data.categoryId = payload.categoryId ? BigInt(payload.categoryId) : null;
  }

  if (payload.firstName !== undefined) {
    data.firstName = payload.firstName.trim();
  }

  if (payload.lastName !== undefined) {
    data.lastName = payload.lastName.trim();
  }

  if (payload.slug !== undefined || payload.firstName !== undefined || payload.lastName !== undefined) {
    const rawSlug =
      payload.slug ||
      `${payload.firstName || ''} ${payload.lastName || ''}`.trim();

    const baseSlug = generateSlug(rawSlug);

    if (baseSlug) {
      data.slug = await ensureUniqueSlug(baseSlug, currentId);
    }
  }

  const nullableFields = [
    'photoUrl',
    'bannerUrl',
    'email',
    'phone',
    'whatsapp',
    'facebookUrl',
    'instagramUrl',
    'tiktokUrl',
    'youtubeUrl',
    'websiteUrl',
    'documentType',
    'documentNumber',
    'personalStory',
    'shortBio',
    'locationText',
    'city',
    'department',
    'country',
    'rejectionReason',
  ];

  nullableFields.forEach((field) => {
    if (payload[field] !== undefined) {
      data[field] = payload[field] || null;
    }
  });

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (payload.isFeatured !== undefined) {
    data.isFeatured = payload.isFeatured;
  }

  if (payload.featuredOrder !== undefined) {
    data.featuredOrder = toNumberOrNull(payload.featuredOrder);
  }

  return data;
};

const buildWhere = ({ status, categoryId, city, department, search, isFeatured }) => {
  const where = {};

  if (status) {
    where.status = status;
  } else {
    where.status = {
      in: ADMIN_VISIBLE_STATUSES,
    };
  }

  if (categoryId) {
    where.categoryId = BigInt(categoryId);
  }

  if (city) {
    where.city = {
      contains: city,
    };
  }

  if (department) {
    where.department = {
      contains: department,
    };
  }

  if (isFeatured === 'true') {
    where.isFeatured = true;
  }

  if (isFeatured === 'false') {
    where.isFeatured = false;
  }

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
        },
      },
      {
        lastName: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
        },
      },
      {
        phone: {
          contains: search,
        },
      },
      {
        whatsapp: {
          contains: search,
        },
      },
      {
        shortBio: {
          contains: search,
        },
      },
      {
        personalStory: {
          contains: search,
        },
      },
      {
        city: {
          contains: search,
        },
      },
      {
        department: {
          contains: search,
        },
      },
    ];
  }

  return where;
};

const createEntrepreneur = async (payload, req) => {
  if (payload.documentType && payload.documentNumber) {
    const existingDocument = await entrepreneurRepository.findEntrepreneurByDocument(
      payload.documentType,
      payload.documentNumber
    );

    if (existingDocument) {
      throw new AppError('Ya existe una emprendedora con ese documento.', 409);
    }
  }

  if (payload.userId) {
    const existingUserProfile = await entrepreneurRepository.findEntrepreneurByUserId(payload.userId);

    if (existingUserProfile) {
      throw new AppError('Ese usuario ya está asociado a una emprendedora.', 409);
    }
  }

  const data = await cleanEntrepreneurPayload({
    ...payload,
    country: payload.country || 'Colombia',
    status: payload.status || 'draft',
  });

  const entrepreneur = await entrepreneurRepository.createEntrepreneur(data);

  await auditRepository.createAuditLog({
    userId: req.user?.sub ? BigInt(req.user.sub) : null,
    action: 'create',
    entityType: 'entrepreneur',
    entityId: entrepreneur.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: null,
    newValues: jsonOrNull(data),
    description: 'Creación de emprendedora por admin/editor.',
  });

  return normalizeEntrepreneur(entrepreneur);
};

const listEntrepreneurs = async (query = {}) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

  const skip = (safePage - 1) * safeLimit;
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    entrepreneurRepository.listEntrepreneurs({
      skip,
      take: safeLimit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    entrepreneurRepository.countEntrepreneurs(where),
  ]);

  return {
    items: items.map(normalizeEntrepreneur),
    pagination: normalizePagination({
      page: safePage,
      limit: safeLimit,
      total,
    }),
  };
};

const listPublicEntrepreneurs = async (query = {}) => {
  return listEntrepreneurs({
    ...query,
    status: 'approved',
  });
};

const getEntrepreneurById = async (id) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const getEntrepreneurBySlug = async (slug) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurBySlug(slug);

  if (!entrepreneur) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const getPublicEntrepreneurById = async (id) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur || entrepreneur.status !== 'approved') {
    throw new AppError('Emprendedora no disponible públicamente.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const getPublicEntrepreneurBySlug = async (slug) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurBySlug(slug);

  if (!entrepreneur || entrepreneur.status !== 'approved') {
    throw new AppError('Emprendedora no disponible públicamente.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const updateEntrepreneur = async (id, payload, req) => {
  const current = await entrepreneurRepository.findEntrepreneurById(id);

  if (!current) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  if (payload.documentType && payload.documentNumber) {
    const existingDocument = await entrepreneurRepository.findEntrepreneurByDocument(
      payload.documentType,
      payload.documentNumber
    );

    if (existingDocument && existingDocument.id.toString() !== id.toString()) {
      throw new AppError('Ya existe otra emprendedora con ese documento.', 409);
    }
  }

  if (payload.userId) {
    const existingUserProfile = await entrepreneurRepository.findEntrepreneurByUserId(payload.userId);

    if (existingUserProfile && existingUserProfile.id.toString() !== id.toString()) {
      throw new AppError('Ese usuario ya está asociado a otra emprendedora.', 409);
    }
  }

  const data = await cleanEntrepreneurPayload(payload, id);

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, data);

  await auditRepository.createAuditLog({
    userId: req.user?.sub ? BigInt(req.user.sub) : null,
    action: 'update',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: jsonOrNull({
      status: current.status,
      firstName: current.firstName,
      lastName: current.lastName,
      categoryId: current.categoryId,
      city: current.city,
      department: current.department,
    }),
    newValues: jsonOrNull(data),
    description: 'Actualización de emprendedora por admin/editor.',
  });

  return normalizeEntrepreneur(updated);
};

const approveEntrepreneur = async (id, reviewerId, req) => {
  const current = await entrepreneurRepository.findEntrepreneurById(id);

  if (!current) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  const previousStatus = current.status;

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, {
    status: 'approved',
    approvedAt: new Date(),
    approvedBy: BigInt(reviewerId),
    rejectedAt: null,
    rejectionReason: null,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'approved',
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Emprendedora aprobada.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'approve',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: jsonOrNull({ status: previousStatus }),
    newValues: jsonOrNull({ status: 'approved' }),
    description: 'Aprobación de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const rejectEntrepreneur = async (id, reviewerId, rejectionReason, req) => {
  const current = await entrepreneurRepository.findEntrepreneurById(id);

  if (!current) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  const previousStatus = current.status;

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, {
    status: 'rejected',
    rejectedAt: new Date(),
    rejectionReason,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'rejected',
    reviewedBy: BigInt(reviewerId),
    reviewComment: rejectionReason,
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'reject',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: jsonOrNull({ status: previousStatus }),
    newValues: jsonOrNull({ status: 'rejected', rejectionReason }),
    description: 'Rechazo de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const updateEntrepreneurStatus = async (id, status, reviewerId, req) => {
  const current = await entrepreneurRepository.findEntrepreneurById(id);

  if (!current) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  const previousStatus = current.status;

  const data = {
    status,
  };

  if (status === 'approved') {
    data.approvedAt = new Date();
    data.approvedBy = BigInt(reviewerId);
    data.rejectedAt = null;
    data.rejectionReason = null;
  }

  if (status === 'rejected') {
    data.rejectedAt = new Date();
  }

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, data);

  await approvalRepository.createApprovalLog({
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    previousStatus,
    newStatus: status,
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Cambio manual de estado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'status_change',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: jsonOrNull({ status: previousStatus }),
    newValues: jsonOrNull({ status }),
    description: 'Cambio de estado de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const updateEntrepreneurFeatured = async (id, payload, req) => {
  const current = await entrepreneurRepository.findEntrepreneurById(id);

  if (!current) {
    throw new AppError('Emprendedora no encontrada.', 404);
  }

  const data = {
    isFeatured: payload.isFeatured,
    featuredOrder: toNumberOrNull(payload.featuredOrder),
  };

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, data);

  await auditRepository.createAuditLog({
    userId: req.user?.sub ? BigInt(req.user.sub) : null,
    action: 'update',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: jsonOrNull({
      isFeatured: current.isFeatured,
      featuredOrder: current.featuredOrder,
    }),
    newValues: jsonOrNull(data),
    description: 'Actualización de destacado de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

module.exports = {
  createEntrepreneur,
  listEntrepreneurs,
  listPublicEntrepreneurs,
  getEntrepreneurById,
  getEntrepreneurBySlug,
  getPublicEntrepreneurById,
  getPublicEntrepreneurBySlug,
  updateEntrepreneur,
  approveEntrepreneur,
  rejectEntrepreneur,
  updateEntrepreneurStatus,
  updateEntrepreneurFeatured,
};