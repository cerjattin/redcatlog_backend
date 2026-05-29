const productService = require('../services/product.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const createMyProduct = asyncHandler(async (req, res) => {
  const result = await productService.createMyProduct(req.user.sub, req.validated.body, req);
  return successResponse(res, 'Producto creado correctamente.', result, 201);
});

const listMyProducts = asyncHandler(async (req, res) => {
  const result = await productService.listMyProducts(req.user.sub);
  return successResponse(res, 'Mis productos obtenidos correctamente.', result);
});

const getMyProductById = asyncHandler(async (req, res) => {
  const result = await productService.getMyProductById(req.user.sub, req.validated.params.id);
  return successResponse(res, 'Mi producto obtenido correctamente.', result);
});

const updateMyProduct = asyncHandler(async (req, res) => {
  const result = await productService.updateMyProduct(
    req.user.sub,
    req.validated.params.id,
    req.validated.body,
    req
  );

  return successResponse(res, 'Producto actualizado correctamente.', result);
});

const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.validated.query);
  return successResponse(res, 'Productos obtenidos correctamente.', result);
});

const getProductById = asyncHandler(async (req, res) => {
  const result = await productService.getById(req.validated.params.id);
  return successResponse(res, 'Producto obtenido correctamente.', result);
});

const approveProduct = asyncHandler(async (req, res) => {
  const result = await productService.approve(req.validated.params.id, req.user.sub, req);
  return successResponse(res, 'Producto aprobado correctamente.', result);
});

const rejectProduct = asyncHandler(async (req, res) => {
  const result = await productService.reject(
    req.validated.params.id,
    req.user.sub,
    req.validated.body.rejectionReason,
    req
  );

  return successResponse(res, 'Producto rechazado correctamente.', result);
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const result = await productService.updateStatus(
    req.validated.params.id,
    req.validated.body.status,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de producto actualizado correctamente.', result);
});

const addProductImage = asyncHandler(async (req, res) => {
  const result = await productService.addImage(
    req.user.sub,
    req.validated.params.id,
    req.validated.body
  );

  return successResponse(res, 'Imagen de producto agregada correctamente.', result, 201);
});

const deleteProductImage = asyncHandler(async (req, res) => {
  await productService.deleteImage(
    req.user.sub,
    req.validated.params.id,
    req.validated.params.imageId
  );

  return successResponse(res, 'Imagen de producto eliminada correctamente.');
});

const listPublicProducts = asyncHandler(async (req, res) => {
  const result = await productService.listPublicProducts(req.query);
  return successResponse(res, 'Productos públicos obtenidos correctamente.', result);
});

const getPublicProductBySlug = asyncHandler(async (req, res) => {
  const result = await productService.getPublicProductBySlug(req.params.slug);
  return successResponse(res, 'Producto público obtenido correctamente.', result);
});

module.exports = {
  createMyProduct,
  listMyProducts,
  getMyProductById,
  updateMyProduct,
  listProducts,
  getProductById,
  approveProduct,
  rejectProduct,
  updateProductStatus,
  addProductImage,
  deleteProductImage,
  listPublicProducts,
  getPublicProductBySlug,
};
