const { prisma } = require('../config/prisma');

const baseInclude = {
  entrepreneur: {
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  },

  mainCategory: true,

  approvedByUser: true,

  socialLinks: true,

  products: true,
};

const findBusinessById = async (id) => {
  return prisma.business.findUnique({
    where: {
      id: BigInt(id),
    },
    include: baseInclude,
  });
};

const findBusinessBySlug = async (slug) => {
  return prisma.business.findUnique({
    where: {
      slug,
    },
    include: baseInclude,
  });
};

const findBusinessesByEntrepreneurId = async (entrepreneurId) => {
  return prisma.business.findMany({
    where: {
      entrepreneurId: BigInt(entrepreneurId),
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: baseInclude,
  });
};

/*
 * Alias temporal para compatibilidad con servicios existentes.
 * Algunos servicios pueden estar usando el nombre singular.
 */
const findBusinessByEntrepreneurId = findBusinessesByEntrepreneurId;

const createBusiness = async (data) => {
  return prisma.business.create({
    data,
    include: baseInclude,
  });
};

const updateBusinessById = async (id, data) => {
  return prisma.business.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: baseInclude,
  });
};

const listBusinesses = async ({ skip, take, where }) => {
  return prisma.business.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: baseInclude,
  });
};

const countBusinesses = async (where) => {
  return prisma.business.count({
    where,
  });
};

module.exports = {
  findBusinessById,
  findBusinessBySlug,
  findBusinessesByEntrepreneurId,
  findBusinessByEntrepreneurId,
  createBusiness,
  updateBusinessById,
  listBusinesses,
  countBusinesses,
};