const { prisma } = require('../config/prisma');

const baseInclude = {
  entrepreneur: {
    include: {
      user: {
        include: {
          role: true,
        },
      },
      category: true,
    },
  },

  category: true,

  approvedByUser: true,

  images: {
    orderBy: [
      { isMain: 'desc' },
      { sortOrder: 'asc' },
      { id: 'asc' },
    ],
  },
};

const findProductById = async (id) => {
  return prisma.product.findUnique({
    where: {
      id: BigInt(id),
    },
    include: baseInclude,
  });
};

const findProductBySlug = async (slug) => {
  return prisma.product.findFirst({
    where: {
      slug,
    },
    include: baseInclude,
  });
};

const createProduct = async (data) => {
  return prisma.product.create({
    data,
    include: baseInclude,
  });
};

const updateProductById = async (id, data) => {
  return prisma.product.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: baseInclude,
  });
};

const listProducts = async ({ skip, take, where, orderBy }) => {
  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy: orderBy || {
      createdAt: 'desc',
    },
    include: baseInclude,
  });
};

const countProducts = async (where) => {
  return prisma.product.count({
    where,
  });
};

const createProductImage = async (data) => {
  return prisma.productImage.create({
    data,
  });
};

const findProductImageById = async (imageId) => {
  return prisma.productImage.findUnique({
    where: {
      id: BigInt(imageId),
    },
  });
};

const updateProductImageById = async (imageId, data) => {
  return prisma.productImage.update({
    where: {
      id: BigInt(imageId),
    },
    data,
  });
};

const deleteProductImageById = async (imageId) => {
  return prisma.productImage.delete({
    where: {
      id: BigInt(imageId),
    },
  });
};

const unsetMainImages = async (productId) => {
  return prisma.productImage.updateMany({
    where: {
      productId: BigInt(productId),
    },
    data: {
      isMain: false,
    },
  });
};

const countProductImages = async (productId) => {
  return prisma.productImage.count({
    where: {
      productId: BigInt(productId),
    },
  });
};

const getNextImageSortOrder = async (productId) => {
  const lastImage = await prisma.productImage.findFirst({
    where: {
      productId: BigInt(productId),
    },
    orderBy: {
      sortOrder: 'desc',
    },
  });

  return lastImage ? lastImage.sortOrder + 1 : 1;
};

module.exports = {
  baseInclude,
  findProductById,
  findProductBySlug,
  createProduct,
  updateProductById,
  listProducts,
  countProducts,
  createProductImage,
  findProductImageById,
  updateProductImageById,
  deleteProductImageById,
  unsetMainImages,
  countProductImages,
  getNextImageSortOrder,
};