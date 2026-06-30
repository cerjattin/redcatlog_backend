const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const productRepository = require('../repositories/product.repository');
const businessRepository = require('../repositories/business.repository');
const entrepreneurRepository = require('../repositories/entrepreneur.repository');
const approvalRepository = require('../repositories/approval.repository');
const auditRepository = require('../repositories/audit.repository');

const VALID_BUSINESS_STATUSES_FOR_PRODUCTS = ['approved', 'published'];

const idsAreEqual = (left, right) => {
  return toStringId(left) === toStringId(right);
};

const normalizeProductBusiness = (business) => {
  if (!business) return null;

  const contactWhatsapp = business.contactWhatsapp ?? business.whatsapp ?? null;
  const contactPhone = business.contactPhone ?? business.phone ?? null;
  const contactEmail = business.contactEmail ?? business.email ?? null;
  const addressText = business.addressText ?? business.address ?? null;

  return {
    id: toStringId(business.id),
    name: business.name,
    slug: business.slug,
    description: business.description ?? null,
    logoUrl: business.logoUrl ?? null,
    bannerUrl: business.bannerUrl ?? null,

    contactWhatsapp,
    contactPhone,
    contactEmail,
    addressText,

    // Aliases de compatibilidad para frontends anteriores.
    whatsapp: business.whatsapp ?? contactWhatsapp,
    phone: business.phone ?? contactPhone,
    email: business.email ?? contactEmail,
    address: business.address ?? addressText,

    instagramUrl: business.instagramUrl ?? null,
    facebookUrl: business.facebookUrl ?? null,
    tiktokUrl: business.tiktokUrl ?? null,
    websiteUrl: business.websiteUrl ?? null,
  };
};

const normalizeProduct = (product) => ({
  id: toStringId(product.id),
  businessId: toStringId(product.businessId),
  categoryId: product.categoryId ? toStringId(product.categoryId) : null,
  name: product.name,
  slug: product.slug,
  shortDescription: product.shortDescription,
  description: product.description,
  price: product.price !== null && product.price !== undefined ? Number(product.price) : null,
  hasPrice: product.hasPrice,
  stock: product.stock,
  managesStock: product.managesStock,
  status: product.status,
  isFeatured: product.isFeatured,
  featuredOrder: product.featuredOrder,
  approvedAt: product.approvedAt,
  approvedBy: product.approvedBy ? toStringId(product.approvedBy) : null,
  rejectedAt: product.rejectedAt,
  rejectionReason: product.rejectionReason,
  publishedAt: product.publishedAt,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  category: product.category
    ? {
        id: toStringId(product.category.id),
        name: product.category.name,
        slug: product.category.slug,
      }
    : null,
  business: normalizeProductBusiness(product.business),
  images: product.images
    ? product.images.map((img) => ({
        id: toStringId(img.id),
        imageUrl: img.imageUrl,
        altText: img.altText,
        sortOrder: img.sortOrder,
        isMain: img.isMain,
      }))
    : [],
});

const cleanPayload = (payload) => {
  const data = {
    businessId: payload.businessId ? BigInt(payload.businessId) : undefined,
    categoryId: payload.categoryId ? BigInt(payload.categoryId) : null,
    name: payload.name,
    slug: payload.slug,
    shortDescription: payload.shortDescription,
    description: payload.description,
    price: payload.price,
    hasPrice: payload.hasPrice,
    stock: payload.stock,
    managesStock: payload.managesStock,
    status: payload.status,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const getEntrepreneurByUserIdOrFail = async (userId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('Primero debes crear tu perfil de emprendedora.', 409);
  }

  return entrepreneur;
};

const assertBusinessOwnership = async (userId, businessId) => {
  const entrepreneur = await getEntrepreneurByUserIdOrFail(userId);
  const business = await businessRepository.findBusinessById(businessId);

  if (!business) {
    throw new AppError('Emprendimiento no encontrado.', 404);
  }

  if (!idsAreEqual(business.entrepreneurId, entrepreneur.id)) {
    throw new AppError('No tienes permisos para usar este emprendimiento.', 403);
  }

  return { entrepreneur, business };
};

const assertCanCreateProduct = async (userId, businessId) => {
  const { entrepreneur, business } = await assertBusinessOwnership(userId, businessId);

  if (entrepreneur.status !== 'approved') {
    throw new AppError('Tu perfil debe ser aprobado antes de crear productos.', 403);
  }

  if (!VALID_BUSINESS_STATUSES_FOR_PRODUCTS.includes(business.status)) {
    throw new AppError('Primero debes tener un emprendimiento aprobado para crear productos.', 403);
  }

  return { entrepreneur, business };
};

const assertProductOwnership = async (userId, productId) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  await assertBusinessOwnership(userId, product.businessId);

  return product;
};

const createMyProduct = async (userId, payload, req) => {
  await assertCanCreateProduct(userId, payload.businessId);

  const product = await productRepository.createProduct({
    ...cleanPayload(payload),
    status: 'draft',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'product',
    entityId: product.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de producto.',
  });

  return normalizeProduct(product);
};

const listMyProducts = async (userId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    return [];
  }

  const where = {
    business: {
      entrepreneurId: entrepreneur.id,
    },
  };

  const products = await productRepository.listProducts({ skip: 0, take: 100, where });
  return products.map(normalizeProduct);
};

const getMyProductById = async (userId, productId) => {
  const product = await assertProductOwnership(userId, productId);
  return normalizeProduct(product);
};

const updateMyProduct = async (userId, productId, payload, req) => {
  const product = await assertProductOwnership(userId, productId);

  if (product.status === 'published') {
    throw new AppError(
      'Un producto publicado no puede editarse directamente en esta versión.',
      409
    );
  }

  if (payload.businessId) {
    await assertBusinessOwnership(userId, payload.businessId);
  }

  const updated = await productRepository.updateProductById(productId, cleanPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'product',
    entityId: product.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: product.status, slug: product.slug },
    newValues: payload,
    description: 'Actualización de producto.',
  });

  return normalizeProduct(updated);
};

const buildWhere = ({ status, businessId, categoryId, search }) => {
  const where = {};

  if (status) where.status = status;
  if (businessId) where.businessId = BigInt(businessId);
  if (categoryId) where.categoryId = BigInt(categoryId);

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return where;
};

const listProducts = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;
  const skip = (safePage - 1) * safeLimit;
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    productRepository.listProducts({ skip, take: safeLimit, where }),
    productRepository.countProducts(where),
  ]);

  return {
    items: items.map(normalizeProduct),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getById = async (id) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new AppError('Producto no encontrado.', 404);
  return normalizeProduct(product);
};

const approve = async (id, reviewerId, req) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new AppError('Producto no encontrado.', 404);

  const previousStatus = product.status;

  const updated = await productRepository.updateProductById(id, {
    status: 'published',
    approvedAt: new Date(),
    approvedBy: BigInt(reviewerId),
    publishedAt: new Date(),
    rejectedAt: null,
    rejectionReason: null,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'product',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'published',
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Producto aprobado y publicado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'approve',
    entityType: 'product',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status: 'published' },
    description: 'Aprobación de producto.',
  });

  return normalizeProduct(updated);
};

const reject = async (id, reviewerId, rejectionReason) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new AppError('Producto no encontrado.', 404);

  const previousStatus = product.status;

  const updated = await productRepository.updateProductById(id, {
    status: 'rejected',
    rejectedAt: new Date(),
    rejectionReason,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'product',
    entityId: BigInt(id),
    previousStatus,
    newStatus: 'rejected',
    reviewedBy: BigInt(reviewerId),
    reviewComment: rejectionReason,
  });

  return normalizeProduct(updated);
};

const updateStatus = async (id, status, reviewerId, req) => {
  const product = await productRepository.findProductById(id);
  if (!product) throw new AppError('Producto no encontrado.', 404);

  const previousStatus = product.status;

  const updated = await productRepository.updateProductById(id, {
    status,
    publishedAt: status === 'published' ? new Date() : product.publishedAt,
  });

  await approvalRepository.createApprovalLog({
    entityType: 'product',
    entityId: BigInt(id),
    previousStatus,
    newStatus: status,
    reviewedBy: BigInt(reviewerId),
    reviewComment: 'Cambio manual de estado.',
  });

  await auditRepository.createAuditLog({
    userId: BigInt(reviewerId),
    action: 'status_change',
    entityType: 'product',
    entityId: BigInt(id),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: { status: previousStatus },
    newValues: { status },
    description: 'Cambio de estado de producto.',
  });

  return normalizeProduct(updated);
};

const addImage = async (userId, productId, payload) => {
  const product = await assertProductOwnership(userId, productId);

  if (product.images.length >= 3) {
    throw new AppError('Cada producto puede tener máximo 3 imágenes.', 409);
  }

  const requestedSortOrder = payload.sortOrder || product.images.length + 1;

  if (requestedSortOrder < 1 || requestedSortOrder > 3) {
    throw new AppError('El sortOrder debe estar entre 1 y 3.', 400);
  }

  const sortOrderExists = product.images.some((image) => image.sortOrder === requestedSortOrder);

  if (sortOrderExists) {
    throw new AppError(
      `Ya existe una imagen con sortOrder ${requestedSortOrder} para este producto.`,
      409
    );
  }

  const shouldBeMain = payload.isMain ?? product.images.length === 0;

  const image = await productRepository.createProductImage({
    productId: BigInt(productId),
    imageUrl: payload.imageUrl,
    altText: payload.altText || null,
    sortOrder: requestedSortOrder,
    isMain: shouldBeMain,
  });

  return {
    id: toStringId(image.id),
    imageUrl: image.imageUrl,
    altText: image.altText,
    sortOrder: image.sortOrder,
    isMain: image.isMain,
  };
};

const deleteImage = async (userId, productId, imageId) => {
  await assertProductOwnership(userId, productId);

  const image = await productRepository.findProductImageById(imageId);

  if (!image || !idsAreEqual(image.productId, productId)) {
    throw new AppError('Imagen no encontrada.', 404);
  }

  await productRepository.deleteProductImage(imageId);
  return true;
};

const listPublicProducts = async (query) => {
  return listProducts({ ...query, status: 'published' });
};

const getPublicProductBySlug = async (slug) => {
  const product = await productRepository.findProductBySlug(slug);

  if (!product || product.status !== 'published') {
    throw new AppError('Producto no disponible públicamente.', 404);
  }

  return normalizeProduct(product);
};

module.exports = {
  createMyProduct,
  listMyProducts,
  getMyProductById,
  updateMyProduct,
  listProducts,
  getById,
  approve,
  reject,
  updateStatus,
  addImage,
  deleteImage,
  listPublicProducts,
  getPublicProductBySlug,
};
