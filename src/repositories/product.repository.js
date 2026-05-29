const { prisma } = require('../config/prisma');

const baseInclude = {
  business: {
    include: {
      entrepreneur: {
        include: {
          user: true,
        },
      },
    },
  },

  category: true,

  approvedByUser: true,

  images: true,
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

const listProducts = async ({ skip, take, where }) => {
  return prisma.product.findMany({
    where,
    skip,
    take,

    orderBy: {
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

const deleteProductImage = async (imageId) => {
  return prisma.productImage.delete({
    where: {
      id: BigInt(imageId),
    },
  });
};

module.exports = {
  findProductById,
  findProductBySlug,
  createProduct,
  updateProductById,
  listProducts,
  countProducts,
  createProductImage,
  findProductImageById,
  deleteProductImage,
};
