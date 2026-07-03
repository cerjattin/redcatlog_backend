const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const getBody = (req) => req.validated?.body || req.body || {};
const getQuery = (req) => req.validated?.query || req.query || {};
const getParams = (req) => req.validated?.params || req.params || {};

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(getQuery(req));

  return successResponse(res, 'Categorías obtenidas correctamente.', result);
});

const listPublicCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listPublicCategories(getQuery(req));

  return successResponse(res, 'Categorías públicas obtenidas correctamente.', result);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await categoryService.getCategoryById(id);

  return successResponse(res, 'Categoría obtenida correctamente.', result);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = getParams(req);

  const result = await categoryService.getCategoryBySlug(slug);

  return successResponse(res, 'Categoría obtenida correctamente.', result);
});

const getPublicCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = getParams(req);

  const result = await categoryService.getCategoryBySlug(slug);

  return successResponse(res, 'Categoría pública obtenida correctamente.', result);
});

const createCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(
    getBody(req),
    req.user.sub,
    req
  );

  return successResponse(res, 'Categoría creada correctamente.', result, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await categoryService.updateCategory(
    id,
    getBody(req),
    req.user.sub,
    req
  );

  return successResponse(res, 'Categoría actualizada correctamente.', result);
});

const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = getParams(req);
  const { isActive } = getBody(req);

  const result = await categoryService.updateCategoryStatus(
    id,
    isActive,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de categoría actualizado correctamente.', result);
});

module.exports = {
  listCategories,
  listPublicCategories,
  getCategoryById,
  getCategoryBySlug,
  getPublicCategoryBySlug,
  createCategory,
  updateCategory,
  updateCategoryStatus,
};