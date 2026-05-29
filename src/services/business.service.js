const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const businessRepository = require('../repositories/business.repository');
const entrepreneurRepository = require('../repositories/entrepreneur.repository');
const approvalRepository = require('../repositories/approval.repository');
const auditRepository = require('../repositories/audit.repository');

const normalizeBusiness = (business) => {
  if (!business) return null;

  return {
    id: toStringId(business.id),
    entrepreneurId: toStringId(business.entrepreneurId),
    mainCategoryId: toStringId(business.mainCategoryId),
    name: business.name,
    slug: business.slug,
    shortDescription: business.shortDescription,
    description: business.description,
    story: business.story,
    logoUrl: business.logoUrl,
    bannerUrl: business.bannerUrl,
    contactEmail: business.contactEmail,
    contactPhone: business.contactPhone,
    contactWhatsapp: business.contactWhatsapp,
    city: business.city,
    department: business.department,
    country: business.country,
    addressText: business.addressText,
    facebookUrl: business.facebookUrl,
    instagramUrl: business.instagramUrl,
    tiktokUrl: business.tiktokUrl,
    websiteUrl: business.websiteUrl,
    status: business.status,
    isFeatured: business.isFeatured,
    featuredOrder: business.featuredOrder,
    publishedAt: business.publishedAt,
    approvedAt: business.approvedAt,
    approvedBy: toStringId(business.approvedBy),
    rejectedAt: business.rejectedAt,
    rejectionReason: business.rejectionReason,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
    mainCategory: business.mainCategory
      ? {
          id: toStringId(business.mainCategory.id),
          name: business.mainCategory.name,
          slug: business.mainCategory.slug,
        }
      : null,
    entrepreneur: business.entrepreneur
      ? {
          id: toStringId(business.entrepreneur.id),
          status: business.entrepreneur.status,
          user: business.entrepreneur.user
            ? {
                id: toStringId(business.entrepreneur.user.id),
                firstName: business.entrepreneur.user.firstName,
                lastName: business.entrepreneur.user.lastName,
                email: business.entrepreneur.user.email,
              }
            : null,
        }
      : null,
    productsCount: business.products ? business.products.length : 0,
    socialLinks: business.socialLinks || [],
  };
};

const cleanPayload = (payload) => {
  const data = {
    mainCategoryId: payload.mainCategoryId ? BigInt(payload.mainCategoryId) : null,
    name: payload.name,
    slug: payload.slug,
    shortDescription: payload.shortDescription,
    description: payload.description,
    story: payload.story,
    logoUrl: payload.logoUrl,
    bannerUrl: payload.bannerUrl,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    contactWhatsapp: payload.contactWhatsapp,
    city: payload.city,
    department: payload.department,
    country: payload.country || 'Colombia',
    addressText: payload.addressText,
    facebookUrl: payload.facebookUrl,
    instagramUrl: payload.instagramUrl,
    tiktokUrl: payload.tiktokUrl,
    websiteUrl: payload.websiteUrl,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const createMyBusiness = async (userId, payload, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('Debes crear primero tu perfil de emprendedora.', 404);
  }

  if (entrepreneur.status !== 'approved') {
    throw new AppError('Tu perfil de emprendedora debe estar aprobado para crear negocios.', 403);
  }

  const exists = await businessRepository.findBusinessBySlug(payload.slug);

  if (exists) {
    throw new AppError('El slug del emprendimiento ya existe.', 409);
  }

  const business = await businessRepository.createBusiness({
    ...cleanPayload(payload),
    entrepreneurId: entrepreneur.id,
    status: 'draft',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'business',
    entityId: business.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de emprendimiento.',
  });

  return normalizeBusiness(business);
};

const listMyBusinesses = async (userId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('No tienes perfil de emprendedora creado.', 404);
  }

  const businesses = await businessRepository.findBusinessByEntrepreneurId(entrepreneur.id);

  return businesses.map(normalizeBusiness);
};

const getMyBusinessById = async (userId, businessId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);
  const business = await businessRepository.findBusinessById(businessId);

  if (!entrepreneur || !business || business.entrepreneurId !== entrepreneur.id) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  return normalizeBusiness(business);
};

const updateMyBusiness = async (userId, businessId, payload, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);
  const business = await businessRepository.findBusinessById(businessId);

  if (!entrepreneur || !business || business.entrepreneurId !== entrepreneur.id) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  if (business.status === 'published') {
    throw new AppError(
      'Un emprendimiento publicado no puede editarse directamente en esta versión.',
      409
    );
  }

  if (payload.slug && payload.slug !== business.slug) {
    const exists = await businessRepository.findBusinessBySlug(payload.slug);

    if (exists) {
      throw new AppError('El slug del emprendimiento ya existe.', 409);
    }
  }

  const updated = await businessRepository.updateBusinessById(businessId, cleanPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'business',
    entityId: business.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: business.status, slug: business.slug },
    newValues: payload,
    description: 'Actualización de emprendimiento.',
  });

  return normalizeBusiness(updated);
};

const buildWhere = ({ status, city, department, categoryId, search }) => {
  const where = {};

  if (status) where.status = status;
  if (city) where.city = { contains: city };
  if (department) where.department = { contains: department };
  if (categoryId) where.mainCategoryId = BigInt(categoryId);

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
      { story: { contains: search } },
    ];
  }

  return where;
};

const listBusinesses = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

  const skip = (safePage - 1) * safeLimit;
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    businessRepository.listBusinesses({ skip, take: safeLimit, where }),
    businessRepository.countBusinesses(where),
  ]);

  return {
    items: items.map(normalizeBusiness),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getById = async (id) => {
  const business = await businessRepository.findBusinessById(id);

  if (!business) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  return normalizeBusiness(business);
};

const approve = async (id, reviewerId, req) => {
  const business = await businessRepository.findBusinessById(id);

  if (!business) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  const previousStatus = business.status;

  const updated = await businessRepository.updateBusinessById(id, {
    status: 'published',
    approvedAt: new Date(),
    approvedBy: BigInt(reviewerId),
    publishedAt: new Date(),
    rejectedAt: null,
    rejectionReason: null,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'business',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'published',
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Emprendimiento aprobado y publicado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'approve',
    entityType: 'business',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status: 'published' },
    description: 'Aprobación de emprendimiento.',
  });

  return normalizeBusiness(updated);
};

const reject = async (id, reviewerId, rejectionReason, req) => {
  const business = await businessRepository.findBusinessById(id);

  if (!business) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  const previousStatus = business.status;

  const updated = await businessRepository.updateBusinessById(id, {
    status: 'rejected',
    rejectedAt: new Date(),
    rejectionReason,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'business',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'rejected',
    reviewedBy: BigInt(reviewerId),
    reviewComment: rejectionReason,
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'reject',
    entityType: 'business',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status: 'rejected', rejectionReason },
    description: 'Rechazo de emprendimiento.',
  });

  return normalizeBusiness(updated);
};

const updateStatus = async (id, status, reviewerId, req) => {
  const business = await businessRepository.findBusinessById(id);

  if (!business) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  const previousStatus = business.status;

  const data = {
    status,
  };

  if (status === 'published') {
    data.publishedAt = new Date();
  }

  const updated = await businessRepository.updateBusinessById(id, data);

  await approvalRepository.createApprovalLog({
    entityType: 'business',
    entityId: BigInt(id),
    previousStatus,
    newStatus: status,
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Cambio manual de estado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'status_change',
    entityType: 'business',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status },
    description: 'Cambio de estado de emprendimiento.',
  });

  return normalizeBusiness(updated);
};

const listPublicBusinesses = async (query) => {
  return listBusinesses({
    ...query,
    status: 'published',
  });
};

const getPublicBusinessBySlug = async (slug) => {
  const business = await businessRepository.findBusinessBySlug(slug);

  if (!business || business.status !== 'published') {
    throw new AppError('Emprendimiento no disponible públicamente.', 404);
  }

  return normalizeBusiness(business);
};

module.exports = {
  createMyBusiness,
  listMyBusinesses,
  getMyBusinessById,
  updateMyBusiness,
  listBusinesses,
  getById,
  approve,
  reject,
  updateStatus,
  listPublicBusinesses,
  getPublicBusinessBySlug,
};
