const { prisma } = require('../config/prisma');

const baseInclude = {
  user: {
    include: {
      role: true,
    },
  },

  category: true,

  approvedByUser: true,

  products: {
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
      images: {
        orderBy: [
          { isMain: 'desc' },
          { sortOrder: 'asc' },
          { id: 'asc' },
        ],
      },
    },
  },
};

const findEntrepreneurById = async (id) => {
  return prisma.entrepreneur.findUnique({
    where: {
      id: BigInt(id),
    },
    include: baseInclude,
  });
};

const findEntrepreneurByUserId = async (userId) => {
  return prisma.entrepreneur.findFirst({
    where: {
      userId: BigInt(userId),
    },
    include: baseInclude,
  });
};

const findEntrepreneurBySlug = async (slug) => {
  return prisma.entrepreneur.findUnique({
    where: {
      slug,
    },
    include: baseInclude,
  });
};

const createEntrepreneur = async (data) => {
  return prisma.entrepreneur.create({
    data,
    include: baseInclude,
  });
};

const updateEntrepreneurById = async (id, data) => {
  return prisma.entrepreneur.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: baseInclude,
  });
};

const listEntrepreneurs = async ({ skip, take, where }) => {
  return prisma.entrepreneur.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: baseInclude,
  });
};

const countEntrepreneurs = async (where) => {
  return prisma.entrepreneur.count({
    where,
  });
};

module.exports = {
  findEntrepreneurByUserId,
  findEntrepreneurById,
  findEntrepreneurBySlug,
  createEntrepreneur,
  updateEntrepreneurById,
  listEntrepreneurs,
  countEntrepreneurs,
};