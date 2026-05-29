const { prisma } = require('../config/prisma');

const pageInclude = {
  sections: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
};

const findPageById = async (id) => {
  return prisma.cmsPage.findUnique({
    where: {
      id: BigInt(id),
    },
    include: pageInclude,
  });
};

const findPageBySlug = async (slug) => {
  return prisma.cmsPage.findUnique({
    where: {
      slug,
    },
    include: pageInclude,
  });
};

const createPage = async (data) => {
  return prisma.cmsPage.create({
    data,
    include: pageInclude,
  });
};

const updatePageById = async (id, data) => {
  return prisma.cmsPage.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: pageInclude,
  });
};

const listPages = async () => {
  return prisma.cmsPage.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: pageInclude,
  });
};

const createSection = async (data) => {
  return prisma.cmsSection.create({
    data,
  });
};

const findSectionById = async (id) => {
  return prisma.cmsSection.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      page: true,
    },
  });
};

const updateSectionById = async (id, data) => {
  return prisma.cmsSection.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: {
      page: true,
    },
  });
};

const deleteSectionById = async (id) => {
  return prisma.cmsSection.delete({
    where: {
      id: BigInt(id),
    },
  });
};

module.exports = {
  findPageById,
  findPageBySlug,
  createPage,
  updatePageById,
  listPages,
  createSection,
  findSectionById,
  updateSectionById,
  deleteSectionById,
};
