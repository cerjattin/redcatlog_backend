const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const mediaRepository = require('../repositories/media.repository');
const auditRepository = require('../repositories/audit.repository');

const normalizeMediaFile = (file) => ({
  id: toStringId(file.id),
  fileUrl: file.fileUrl,
  fileType: file.fileType,
  mimeType: file.mimeType,
  originalName: file.originalName,
  title: file.title,
  description: file.description,
  altText: file.altText,
  sizeBytes: toStringId(file.sizeBytes),
  width: file.width,
  height: file.height,
  uploadedBy: toStringId(file.uploadedBy),
  createdAt: file.createdAt,
  updatedAt: file.updatedAt,
});

const normalizeGallery = (gallery) => ({
  id: toStringId(gallery.id),
  name: gallery.name,
  slug: gallery.slug,
  description: gallery.description,
  locationKey: gallery.locationKey,
  status: gallery.status,
  sortOrder: gallery.sortOrder,
  createdAt: gallery.createdAt,
  updatedAt: gallery.updatedAt,
  items: gallery.items
    ? gallery.items.map((item) => ({
        id: toStringId(item.id),
        galleryId: toStringId(item.galleryId),
        mediaFileId: toStringId(item.mediaFileId),
        title: item.title,
        caption: item.caption,
        linkUrl: item.linkUrl,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        mediaFile: item.mediaFile
          ? {
              id: toStringId(item.mediaFile.id),
              fileUrl: item.mediaFile.fileUrl,
              fileType: item.mediaFile.fileType,
              altText: item.mediaFile.altText,
              title: item.mediaFile.title,
            }
          : null,
      }))
    : [],
});

const cleanMediaFilePayload = (payload, userId) => ({
  fileUrl: payload.fileUrl,
  fileType: payload.fileType || 'image',
  mimeType: payload.mimeType || null,
  originalName: payload.originalName || null,
  title: payload.title || null,
  description: payload.description || null,
  altText: payload.altText || null,
  uploadedBy: userId ? BigInt(userId) : null,
});

const cleanGalleryPayload = (payload) => {
  const data = {
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    locationKey: payload.locationKey,
    status: payload.status || 'draft',
    sortOrder: payload.sortOrder,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const createMediaFile = async (payload, userId, req) => {
  const file = await mediaRepository.createMediaFile(cleanMediaFilePayload(payload, userId));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'media_file',
    entityId: file.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de archivo multimedia.',
  });

  return normalizeMediaFile(file);
};

const listMediaFiles = async () => {
  const files = await mediaRepository.listMediaFiles();
  return files.map(normalizeMediaFile);
};

const getMediaFileById = async (id) => {
  const file = await mediaRepository.findMediaFileById(id);

  if (!file) {
    throw new AppError('Archivo multimedia no encontrado.', 404);
  }

  return normalizeMediaFile(file);
};

const createGallery = async (payload, userId, req) => {
  const existing = await mediaRepository.findGalleryBySlug(payload.slug);

  if (existing) {
    throw new AppError('Ya existe una galería con ese slug.', 409);
  }

  const gallery = await mediaRepository.createGallery(cleanGalleryPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'media_gallery',
    entityId: gallery.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de galería multimedia.',
  });

  return normalizeGallery(gallery);
};

const listGalleries = async (query = {}) => {
  const where = {};

  if (query.status) where.status = query.status;
  if (query.locationKey) where.locationKey = query.locationKey;

  const galleries = await mediaRepository.listGalleries(where);
  return galleries.map(normalizeGallery);
};

const getGalleryById = async (id) => {
  const gallery = await mediaRepository.findGalleryById(id);

  if (!gallery) {
    throw new AppError('Galería no encontrada.', 404);
  }

  return normalizeGallery(gallery);
};

const updateGallery = async (id, payload, userId, req) => {
  const gallery = await mediaRepository.findGalleryById(id);

  if (!gallery) {
    throw new AppError('Galería no encontrada.', 404);
  }

  if (payload.slug && payload.slug !== gallery.slug) {
    const existing = await mediaRepository.findGalleryBySlug(payload.slug);

    if (existing) {
      throw new AppError('Ya existe una galería con ese slug.', 409);
    }
  }

  const updated = await mediaRepository.updateGalleryById(id, cleanGalleryPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'media_gallery',
    entityId: gallery.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      name: gallery.name,
      slug: gallery.slug,
      status: gallery.status,
    },
    newValues: payload,
    description: 'Actualización de galería multimedia.',
  });

  return normalizeGallery(updated);
};

const addGalleryItem = async (galleryId, payload, userId, req) => {
  const gallery = await mediaRepository.findGalleryById(galleryId);

  if (!gallery) {
    throw new AppError('Galería no encontrada.', 404);
  }

  const mediaFile = await mediaRepository.findMediaFileById(payload.mediaFileId);

  if (!mediaFile) {
    throw new AppError('Archivo multimedia no encontrado.', 404);
  }

  const item = await mediaRepository.createGalleryItem({
    galleryId: BigInt(galleryId),
    mediaFileId: BigInt(payload.mediaFileId),
    title: payload.title || null,
    caption: payload.caption || null,
    linkUrl: payload.linkUrl || null,
    sortOrder: payload.sortOrder || 0,
    isActive: payload.isActive ?? true,
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'media_gallery_item',
    entityId: item.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Elemento agregado a galería multimedia.',
  });

  return {
    id: toStringId(item.id),
    galleryId: toStringId(item.galleryId),
    mediaFileId: toStringId(item.mediaFileId),
    title: item.title,
    caption: item.caption,
    linkUrl: item.linkUrl,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  };
};

const deleteGalleryItem = async (galleryId, itemId, userId, req) => {
  const item = await mediaRepository.findGalleryItemById(itemId);

  if (!item || item.galleryId !== BigInt(galleryId)) {
    throw new AppError('Elemento de galería no encontrado.', 404);
  }

  await mediaRepository.deleteGalleryItem(itemId);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'delete',
    entityType: 'media_gallery_item',
    entityId: BigInt(itemId),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      galleryId: toStringId(item.galleryId),
      mediaFileId: toStringId(item.mediaFileId),
    },
    description: 'Elemento eliminado de galería multimedia.',
  });

  return true;
};

const listPublicGalleries = async (query = {}) => {
  return listGalleries({
    ...query,
    status: 'published',
  });
};

const getPublicGalleryBySlug = async (slug) => {
  const gallery = await mediaRepository.findGalleryBySlug(slug);

  if (!gallery || gallery.status !== 'published') {
    throw new AppError('Galería no disponible públicamente.', 404);
  }

  return normalizeGallery(gallery);
};

module.exports = {
  createMediaFile,
  listMediaFiles,
  getMediaFileById,
  createGallery,
  listGalleries,
  getGalleryById,
  updateGallery,
  addGalleryItem,
  deleteGalleryItem,
  listPublicGalleries,
  getPublicGalleryBySlug,
};
