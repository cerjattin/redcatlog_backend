const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const entrepreneurRepository = require('../repositories/entrepreneur.repository');
const approvalRepository = require('../repositories/approval.repository');
const auditRepository = require('../repositories/audit.repository');

const normalizeEntrepreneur = (entrepreneur) => {
  if (!entrepreneur) return null;

  return {
    id: toStringId(entrepreneur.id),
    userId: toStringId(entrepreneur.userId),
    documentType: entrepreneur.documentType,
    documentNumber: entrepreneur.documentNumber,
    personalStory: entrepreneur.personalStory,
    shortBio: entrepreneur.shortBio,
    locationText: entrepreneur.locationText,
    city: entrepreneur.city,
    department: entrepreneur.department,
    country: entrepreneur.country,
    status: entrepreneur.status,
    approvedAt: entrepreneur.approvedAt,
    approvedBy: toStringId(entrepreneur.approvedBy),
    rejectedAt: entrepreneur.rejectedAt,
    rejectionReason: entrepreneur.rejectionReason,
    createdAt: entrepreneur.createdAt,
    updatedAt: entrepreneur.updatedAt,
    user: entrepreneur.user
      ? {
          id: toStringId(entrepreneur.user.id),
          firstName: entrepreneur.user.firstName,
          lastName: entrepreneur.user.lastName,
          email: entrepreneur.user.email,
          phone: entrepreneur.user.phone,
          whatsapp: entrepreneur.user.whatsapp,
          city: entrepreneur.user.city,
          department: entrepreneur.user.department,
          status: entrepreneur.user.status,
          role: entrepreneur.user.role
            ? {
                id: toStringId(entrepreneur.user.role.id),
                name: entrepreneur.user.role.name,
              }
            : null,
        }
      : null,
    businesses: entrepreneur.businesses
      ? entrepreneur.businesses.map((business) => ({
          id: toStringId(business.id),
          name: business.name,
          slug: business.slug,
          status: business.status,
        }))
      : [],
  };
};

const createMyProfile = async (userId, payload, req) => {
  const existing = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (existing) {
    throw new AppError('Este usuario ya tiene perfil de emprendedora.', 409);
  }

  const entrepreneur = await entrepreneurRepository.createEntrepreneur({
    userId: BigInt(userId),
    documentType: payload.documentType || null,
    documentNumber: payload.documentNumber || null,
    personalStory: payload.personalStory || null,
    shortBio: payload.shortBio || null,
    locationText: payload.locationText || null,
    city: payload.city || null,
    department: payload.department || null,
    country: payload.country || 'Colombia',
    status: 'draft',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'entrepreneur',
    entityId: entrepreneur.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de perfil de emprendedora.',
  });

  return normalizeEntrepreneur(entrepreneur);
};

const getMyProfile = async (userId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('No tienes perfil de emprendedora creado.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const updateMyProfile = async (userId, payload, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('No tienes perfil de emprendedora creado.', 404);
  }

  if (entrepreneur.status === 'approved') {
    throw new AppError('El perfil aprobado no puede editarse directamente en esta versión.', 409);
  }

  const allowedData = {
    documentType: payload.documentType,
    documentNumber: payload.documentNumber,
    personalStory: payload.personalStory,
    shortBio: payload.shortBio,
    locationText: payload.locationText,
    city: payload.city,
    department: payload.department,
    country: payload.country,
    status: payload.status,
  };

  Object.keys(allowedData).forEach((key) => {
    if (allowedData[key] === undefined) delete allowedData[key];
  });

  const updated = await entrepreneurRepository.updateEntrepreneurById(entrepreneur.id, allowedData);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'entrepreneur',
    entityId: entrepreneur.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: entrepreneur,
    newValues: allowedData,
    description: 'Actualización de perfil de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const buildWhere = ({ status, city, department, search }) => {
  const where = {};

  if (status) where.status = status;
  if (city) where.city = { contains: city };
  if (department) where.department = { contains: department };

  if (search) {
    where.OR = [
      { shortBio: { contains: search } },
      { personalStory: { contains: search } },
      {
        user: {
          firstName: {
            contains: search,
          },
        },
      },
      {
        user: {
          lastName: {
            contains: search,
          },
        },
      },
      {
        user: {
          email: {
            contains: search,
          },
        },
      },
    ];
  }

  return where;
};

const listEntrepreneurs = async (query) => {
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
    }),
    entrepreneurRepository.countEntrepreneurs(where),
  ]);

  return {
    items: items.map(normalizeEntrepreneur),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getById = async (id) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur) {
    throw new AppError('Perfil de emprendedora no encontrado.', 404);
  }

  return normalizeEntrepreneur(entrepreneur);
};

const approve = async (id, reviewerId, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur) {
    throw new AppError('Perfil de emprendedora no encontrado.', 404);
  }

  const previousStatus = entrepreneur.status;

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
    reviewComment: 'Perfil aprobado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'approve',
    entityType: 'entrepreneur',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status: 'approved' },
    description: 'Aprobación de perfil de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const reject = async (id, reviewerId, rejectionReason, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur) {
    throw new AppError('Perfil de emprendedora no encontrado.', 404);
  }

  const previousStatus = entrepreneur.status;

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
    oldValues: { status: previousStatus },
    newValues: { status: 'rejected', rejectionReason },
    description: 'Rechazo de perfil de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const updateStatus = async (id, status, reviewerId, req) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(id);

  if (!entrepreneur) {
    throw new AppError('Perfil de emprendedora no encontrado.', 404);
  }

  const previousStatus = entrepreneur.status;

  const updated = await entrepreneurRepository.updateEntrepreneurById(id, {
    status,
  });

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
    oldValues: { status: previousStatus },
    newValues: { status },
    description: 'Cambio de estado de perfil de emprendedora.',
  });

  return normalizeEntrepreneur(updated);
};

const listPublicEntrepreneurs = async (query) => {
  return listEntrepreneurs({
    ...query,
    status: 'approved',
  });
};

module.exports = {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  listEntrepreneurs,
  getById,
  approve,
  reject,
  updateStatus,
  listPublicEntrepreneurs,
};
