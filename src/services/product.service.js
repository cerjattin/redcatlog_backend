const productRepository = require('../repositories/product.repository');
const entrepreneurRepository = require('../repositories/entrepreneur.repository');
const { AppError } = require('../utils/app-error.util');

const toStringId = (value) => {
  if (value === null || value === undefined) return null;
  return value.toString();
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
};

const generateSlug = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
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
          label: user.role.label,
        }
      : null,
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
    type: category.type,
    iconUrl: category.iconUrl,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
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
    category: normalizeCategory(entrepreneur.category),
    user: normalizeUser(entrepreneur.user),
  };
};

const normalizeImage = (image) => ({
  id: toStringId(image.id),
  productId: toStringId(image.productId),
  imageUrl: image.imageUrl,
  altText: image.altText,
  sortOrder: image.sortOrder,
  isMain: image.isMain,
  createdAt: image.createdAt,
  updatedAt: image.updatedAt,
});

const normalizeProduct = (product) => {
  if (!product) return null;

  return {
    id: toStringId(product.id),
    entrepreneurId: toStringId(product.entrepreneurId),
    categoryId: toStringId(product.categoryId),

    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,

    price: product.price !== null && product.price !== undefined ? product.price.toString() : null,
    hasPrice: product.hasPrice,
    stock: product.stock,
    managesStock: product.managesStock,

    status: product.status,
    isFeatured: product.isFeatured,
    featuredOrder: product.featuredOrder,

    approvedAt: product.approvedAt,
    approvedBy: toStringId(product.approvedBy),
    rejectedAt: product.rejectedAt,
    rejectionReason: product.rejectionReason,
    publishedAt: product.publishedAt,

    entrepreneur: normalizeEntrepreneur(product.entrepreneur),
    category: normalizeCategory(product.category),

    images: Array.isArray(product.images)
      ? product.images.map(normalizeImage)
      : [],

    approvedByUser: normalizeUser(product.approvedByUser),

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
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

const cleanProductPayload = (payload) => {
  const data = {};

  if (payload.entrepreneurId !== undefined) {
    data.entrepreneurId = BigInt(payload.entrepreneurId);
  }

  if (payload.categoryId !== undefined) {
    data.categoryId = payload.categoryId ? BigInt(payload.categoryId) : null;
  }

  if (payload.name !== undefined) {
    data.name = payload.name.trim();
  }

  if (payload.slug !== undefined) {
    data.slug = generateSlug(payload.slug);
  } else if (payload.name !== undefined) {
    data.slug = generateSlug(payload.name);
  }

  if (payload.shortDescription !== undefined) {
    data.shortDescription = payload.shortDescription || null;
  }

  if (payload.description !== undefined) {
    data.description = payload.description || null;
  }

  if (payload.price !== undefined) {
    data.price = payload.price === null || payload.price === '' ? null : payload.price;
  }

  if (payload.hasPrice !== undefined) {
    data.hasPrice = payload.hasPrice;
  }

  if (payload.stock !== undefined) {
    data.stock = toNumberOrNull(payload.stock);
  }

  if (payload.managesStock !== undefined) {
    data.managesStock = payload.managesStock;
  }

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

const assertEntrepreneurExists = async (entrepreneurId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurById(entrepreneurId);

  if (!entrepreneur) {
    throw new AppError('La emprendedora indicada no existe.', 404);
  }

  return entrepreneur;
};

const assertEntrepreneurCanReceiveProducts = async (entrepreneurId) => {
  const entrepreneur = await assertEntrepreneurExists(entrepreneurId);

  if (!['approved'].includes(entrepreneur.status)) {
    throw new AppError(
      'La emprendedora debe estar aprobada para asociarle productos.',
      409
    );
  }

  return entrepreneur;
};

const buildWhere = ({ status, entrepreneurId, categoryId, search, isFeatured }) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (entrepreneurId) {
    where.entrepreneurId = BigInt(entrepreneurId);
  }

  if (categoryId) {
    where.categoryId = BigInt(categoryId);
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
        name: {
          contains: search,
        },
      },
      {
        shortDescription: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
    ];
  }

  return where;
};

const listProducts = async (query = {}) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 12);
  const skip = (page - 1) * limit;

  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    productRepository.listProducts({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    productRepository.countProducts(where),
  ]);

  return {
    items: items.map(normalizeProduct),
    pagination: normalizePagination({
      page,
      limit,
      total,
    }),
  };
};

const listPublicProducts = async (query = {}) => {
  return listProducts({
    ...query,
    status: 'published',
  });
};

const getProductById = async (id) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  return normalizeProduct(product);
};

const getPublicProductBySlug = async (slug) => {
  const product = await productRepository.findProductBySlug(slug);

  if (!product || product.status !== 'published') {
    throw new AppError('Producto no encontrado.', 404);
  }

  return normalizeProduct(product);
};

const createProduct = async (payload, req) => {
  await assertEntrepreneurCanReceiveProducts(payload.entrepreneurId);

  const data = cleanProductPayload({
    ...payload,
    status: payload.status || 'draft',
  });

  const product = await productRepository.createProduct(data);

  return normalizeProduct(product);
};

const updateProduct = async (id, payload, req) => {
  const currentProduct = await productRepository.findProductById(id);

  if (!currentProduct) {
    throw new AppError('Producto no encontrado.', 404);
  }

  if (payload.entrepreneurId) {
    await assertEntrepreneurCanReceiveProducts(payload.entrepreneurId);
  }

  const data = cleanProductPayload(payload);

  const updatedProduct = await productRepository.updateProductById(id, data);

  return normalizeProduct(updatedProduct);
};

const approveProduct = async (id, reviewerId) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const updatedProduct = await productRepository.updateProductById(id, {
    status: 'published',
    approvedAt: new Date(),
    approvedBy: BigInt(reviewerId),
    rejectedAt: null,
    rejectionReason: null,
    publishedAt: new Date(),
  });

  return normalizeProduct(updatedProduct);
};

const rejectProduct = async (id, rejectionReason) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const updatedProduct = await productRepository.updateProductById(id, {
    status: 'rejected',
    rejectedAt: new Date(),
    rejectionReason,
  });

  return normalizeProduct(updatedProduct);
};

const updateProductStatus = async (id, status) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const data = {
    status,
  };

  if (status === 'published') {
    data.publishedAt = new Date();
  }

  if (status === 'approved') {
    data.approvedAt = new Date();
  }

  const updatedProduct = await productRepository.updateProductById(id, data);

  return normalizeProduct(updatedProduct);
};

const updateProductFeatured = async (id, payload) => {
  const product = await productRepository.findProductById(id);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const updatedProduct = await productRepository.updateProductById(id, {
    isFeatured: payload.isFeatured,
    featuredOrder: toNumberOrNull(payload.featuredOrder),
  });

  return normalizeProduct(updatedProduct);
};

const addProductImage = async (productId, payload) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const imageCount = await productRepository.countProductImages(productId);

  if (imageCount >= 3) {
    throw new AppError('Solo se permiten máximo 3 imágenes por producto.', 409);
  }

  const nextSortOrder = await productRepository.getNextImageSortOrder(productId);

  const shouldBeMain = imageCount === 0 || payload.isMain === true;

  if (shouldBeMain) {
    await productRepository.unsetMainImages(productId);
  }

  await productRepository.createProductImage({
    productId: BigInt(productId),
    imageUrl: payload.imageUrl,
    altText: payload.altText || product.name,
    sortOrder: payload.sortOrder || nextSortOrder,
    isMain: shouldBeMain,
  });

  const updatedProduct = await productRepository.findProductById(productId);

  return normalizeProduct(updatedProduct);
};

const uploadProductImage = async (productId, file, payload = {}) => {
  if (!file) {
    throw new AppError('No se recibió archivo.', 400);
  }

  return addProductImage(productId, {
    imageUrl: file.fileUrl || file.path || file.location,
    altText: payload.altText,
    isMain: payload.isMain === true || payload.isMain === 'true',
  });
};

const setMainProductImage = async (productId, imageId) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const image = await productRepository.findProductImageById(imageId);

  if (!image || image.productId.toString() !== productId.toString()) {
    throw new AppError('Imagen no encontrada para este producto.', 404);
  }

  await productRepository.unsetMainImages(productId);

  await productRepository.updateProductImageById(imageId, {
    isMain: true,
  });

  const updatedProduct = await productRepository.findProductById(productId);

  return normalizeProduct(updatedProduct);
};

const deleteProductImage = async (productId, imageId) => {
  const product = await productRepository.findProductById(productId);

  if (!product) {
    throw new AppError('Producto no encontrado.', 404);
  }

  const image = await productRepository.findProductImageById(imageId);

  if (!image || image.productId.toString() !== productId.toString()) {
    throw new AppError('Imagen no encontrada para este producto.', 404);
  }

  await productRepository.deleteProductImageById(imageId);

  const updatedProduct = await productRepository.findProductById(productId);

  return normalizeProduct(updatedProduct);
};

module.exports = {
  listProducts,
  listPublicProducts,
  getProductById,
  getPublicProductBySlug,
  createProduct,
  updateProduct,
  approveProduct,
  rejectProduct,
  updateProductStatus,
  updateProductFeatured,
  addProductImage,
  uploadProductImage,
  setMainProductImage,
  deleteProductImage,
};