const mediaService = require('../services/media.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const createMediaFile = asyncHandler(async (req, res) => {
  const result = await mediaService.createMediaFile(req.validated.body, req.user.sub, req);
  return successResponse(res, 'Archivo multimedia creado correctamente.', result, 201);
});

const listMediaFiles = asyncHandler(async (_req, res) => {
  const result = await mediaService.listMediaFiles();
  return successResponse(res, 'Archivos multimedia obtenidos correctamente.', result);
});

const getMediaFileById = asyncHandler(async (req, res) => {
  const result = await mediaService.getMediaFileById(req.validated.params.id);
  return successResponse(res, 'Archivo multimedia obtenido correctamente.', result);
});

const createGallery = asyncHandler(async (req, res) => {
  const result = await mediaService.createGallery(req.validated.body, req.user.sub, req);
  return successResponse(res, 'Galería multimedia creada correctamente.', result, 201);
});

const listGalleries = asyncHandler(async (req, res) => {
  const result = await mediaService.listGalleries(req.query);
  return successResponse(res, 'Galerías multimedia obtenidas correctamente.', result);
});

const getGalleryById = asyncHandler(async (req, res) => {
  const result = await mediaService.getGalleryById(req.validated.params.id);
  return successResponse(res, 'Galería multimedia obtenida correctamente.', result);
});

const updateGallery = asyncHandler(async (req, res) => {
  const result = await mediaService.updateGallery(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Galería multimedia actualizada correctamente.', result);
});

const addGalleryItem = asyncHandler(async (req, res) => {
  const result = await mediaService.addGalleryItem(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Elemento agregado a galería correctamente.', result, 201);
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  await mediaService.deleteGalleryItem(
    req.validated.params.id,
    req.validated.params.itemId,
    req.user.sub,
    req
  );

  return successResponse(res, 'Elemento eliminado de galería correctamente.');
});

const listPublicGalleries = asyncHandler(async (req, res) => {
  const result = await mediaService.listPublicGalleries(req.query);
  return successResponse(res, 'Galerías públicas obtenidas correctamente.', result);
});

const getPublicGalleryBySlug = asyncHandler(async (req, res) => {
  const result = await mediaService.getPublicGalleryBySlug(req.params.slug);
  return successResponse(res, 'Galería pública obtenida correctamente.', result);
});

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
