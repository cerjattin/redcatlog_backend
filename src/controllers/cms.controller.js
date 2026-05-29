const cmsService = require('../services/cms.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const listPages = asyncHandler(async (_req, res) => {
  const result = await cmsService.listPages();
  return successResponse(res, 'Páginas CMS obtenidas correctamente.', result);
});

const getPageById = asyncHandler(async (req, res) => {
  const result = await cmsService.getPageById(req.validated.params.id);
  return successResponse(res, 'Página CMS obtenida correctamente.', result);
});

const createPage = asyncHandler(async (req, res) => {
  const result = await cmsService.createPage(req.validated.body, req.user.sub, req);
  return successResponse(res, 'Página CMS creada correctamente.', result, 201);
});

const updatePage = asyncHandler(async (req, res) => {
  const result = await cmsService.updatePage(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Página CMS actualizada correctamente.', result);
});

const createSection = asyncHandler(async (req, res) => {
  const result = await cmsService.createSection(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Sección CMS creada correctamente.', result, 201);
});

const updateSection = asyncHandler(async (req, res) => {
  const result = await cmsService.updateSection(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Sección CMS actualizada correctamente.', result);
});

const deleteSection = asyncHandler(async (req, res) => {
  await cmsService.deleteSection(req.validated.params.id, req.user.sub, req);
  return successResponse(res, 'Sección CMS eliminada correctamente.');
});

const getPublicPageBySlug = asyncHandler(async (req, res) => {
  const result = await cmsService.getPublicPageBySlug(req.params.slug);
  return successResponse(res, 'Página CMS pública obtenida correctamente.', result);
});

module.exports = {
  listPages,
  getPageById,
  createPage,
  updatePage,
  createSection,
  updateSection,
  deleteSection,
  getPublicPageBySlug,
};
