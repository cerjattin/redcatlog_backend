const { prisma } = require('../config/prisma');

const baseInclude = {
  parent: true,
  children: true,
};

const findCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: {
      id: BigInt(id),
    },
    include: baseInclude,
  });
};

const findCategoryBySlug = async (slug) => {
  return prisma.category.findUnique({
    where: {
      slug,
    },
    include: baseInclude,
  });
};

const createCategory = async (data) => {
  return prisma.category.create({
    data,
    include: baseInclude,
  });
};

const updateCategoryById = async (id, data) => {
  return prisma.category.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: baseInclude,
  });
};

const listCategories = async (where = {}) => {
  return prisma.category.findMany({
    where,
    orderBy: [
      {
        sortOrder: 'asc',
      },
      {
        name: 'asc',
      },
    ],
    include: baseInclude,
  });
};

module.exports = {
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategoryById,
  listCategories,
};
