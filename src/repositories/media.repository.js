const { prisma } = require('../config/prisma');

const mediaFileInclude = {
  uploadedByUser: true,
};

const galleryInclude = {
  items: {
    include: {
      mediaFile: true,
    },
  },
};

const findMediaFileById = async (id) => {
  return prisma.mediaFile.findUnique({
    where: {
      id: BigInt(id),
    },
    include: mediaFileInclude,
  });
};

const createMediaFile = async (data) => {
  return prisma.mediaFile.create({
    data,
    include: mediaFileInclude,
  });
};

const listMediaFiles = async () => {
  return prisma.mediaFile.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: mediaFileInclude,
  });
};

const findGalleryById = async (id) => {
  return prisma.mediaGallery.findUnique({
    where: {
      id: BigInt(id),
    },
    include: galleryInclude,
  });
};

const findGalleryBySlug = async (slug) => {
  return prisma.mediaGallery.findUnique({
    where: {
      slug,
    },
    include: galleryInclude,
  });
};

const createGallery = async (data) => {
  return prisma.mediaGallery.create({
    data,
    include: galleryInclude,
  });
};

const updateGalleryById = async (id, data) => {
  return prisma.mediaGallery.update({
    where: {
      id: BigInt(id),
    },
    data,
    include: galleryInclude,
  });
};

const listGalleries = async (where = {}) => {
  return prisma.mediaGallery.findMany({
    where,

    orderBy: {
      createdAt: 'desc',
    },

    include: galleryInclude,
  });
};

const createGalleryItem = async (data) => {
  return prisma.mediaGalleryItem.create({
    data,
  });
};

const findGalleryItemById = async (id) => {
  return prisma.mediaGalleryItem.findUnique({
    where: {
      id: BigInt(id),
    },
  });
};

const deleteGalleryItem = async (id) => {
  return prisma.mediaGalleryItem.delete({
    where: {
      id: BigInt(id),
    },
  });
};

module.exports = {
  findMediaFileById,
  createMediaFile,
  listMediaFiles,
  findGalleryById,
  findGalleryBySlug,
  createGallery,
  updateGalleryById,
  listGalleries,
  createGalleryItem,
  findGalleryItemById,
  deleteGalleryItem,
};
