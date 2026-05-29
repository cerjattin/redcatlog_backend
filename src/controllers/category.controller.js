const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listCategories(req.validated.query);
  return successResponse(res, 'Categorías obtenidas correctamente.', result);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategoryById(req.validated.params.id);
  return successResponse(res, 'Categoría obtenida correctamente.', result);
});

const createCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(req.validated.body, req.user.sub, req);
  return successResponse(res, 'Categoría creada correctamente.', result, 201);
});

const updateCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.updateCategory(
    req.validated.params.id,
    req.validated.body,
    req.user.sub,
    req
  );

  return successResponse(res, 'Categoría actualizada correctamente.', result);
});

const updateCategoryStatus = asyncHandler(async (req, res) => {
  const result = await categoryService.updateCategoryStatus(
    req.validated.params.id,
    req.validated.body.isActive,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de categoría actualizado correctamente.', result);
});

const listPublicCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.listPublicCategories(req.query);
  return successResponse(res, 'Categorías públicas obtenidas correctamente.', result);
});

const getPublicCategoryBySlug = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategoryBySlug(req.params.slug);
  return successResponse(res, 'Categoría pública obtenida correctamente.', result);
});

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  listPublicCategories,
  getPublicCategoryBySlug,
};
