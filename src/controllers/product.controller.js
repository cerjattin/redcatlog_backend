const productService = require('../services/product.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');

const getBody = (req) => req.validated?.body || req.body || {};
const getQuery = (req) => req.validated?.query || req.query || {};
const getParams = (req) => req.validated?.params || req.params || {};

const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(getBody(req), req);

  return successResponse(res, 'Producto creado correctamente.', result, 201);
});

const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(getQuery(req));

  return successResponse(res, 'Productos obtenidos correctamente.', result);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.getProductById(id);

  return successResponse(res, 'Producto obtenido correctamente.', result);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.updateProduct(id, getBody(req), req);

  return successResponse(res, 'Producto actualizado correctamente.', result);
});

const approveProduct = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.approveProduct(id, req.user.sub);

  return successResponse(res, 'Producto aprobado correctamente.', result);
});

const rejectProduct = asyncHandler(async (req, res) => {
  const { id } = getParams(req);
  const { rejectionReason } = getBody(req);

  const result = await productService.rejectProduct(id, rejectionReason);

  return successResponse(res, 'Producto rechazado correctamente.', result);
});

const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = getParams(req);
  const { status } = getBody(req);

  const result = await productService.updateProductStatus(id, status);

  return successResponse(res, 'Estado de producto actualizado correctamente.', result);
});

const updateProductFeatured = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.updateProductFeatured(id, getBody(req));

  return successResponse(res, 'Producto destacado actualizado correctamente.', result);
});

const addProductImage = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.addProductImage(id, getBody(req));

  return successResponse(res, 'Imagen de producto agregada correctamente.', result, 201);
});

const uploadProductImage = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await productService.uploadProductImage(id, req.file, getBody(req));

  return successResponse(res, 'Imagen de producto subida correctamente.', result, 201);
});

const setMainProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = getParams(req);

  const result = await productService.setMainProductImage(id, imageId);

  return successResponse(res, 'Imagen principal actualizada correctamente.', result);
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = getParams(req);

  const result = await productService.deleteProductImage(id, imageId);

  return successResponse(res, 'Imagen de producto eliminada correctamente.', result);
});

const listPublicProducts = asyncHandler(async (req, res) => {
  const result = await productService.listPublicProducts(getQuery(req));

  return successResponse(res, 'Productos públicos obtenidos correctamente.', result);
});

const getPublicProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = getParams(req);

  const result = await productService.getPublicProductBySlug(slug);

  return successResponse(res, 'Producto público obtenido correctamente.', result);
});

/**
 * Legacy handlers.
 * Estos métodos existían cuando la emprendedora administraba sus propios productos.
 * En la nueva lógica REDMUEMMA solo admin/editor gestionan productos.
 * Se dejan temporalmente para evitar errores de importación mientras se ajustan rutas.
 */
const legacyMyProductsDisabled = asyncHandler(async () => {
  throw new AppError(
    'Este endpoint fue desactivado. En REDMUEMMA los productos son gestionados por admin/editor y pertenecen directamente a una emprendedora.',
    410
  );
});

const createMyProduct = legacyMyProductsDisabled;
const listMyProducts = legacyMyProductsDisabled;
const getMyProductById = legacyMyProductsDisabled;
const updateMyProduct = legacyMyProductsDisabled;

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  approveProduct,
  rejectProduct,
  updateProductStatus,
  updateProductFeatured,
  addProductImage,
  uploadProductImage,
  setMainProductImage,
  deleteProductImage,

  listPublicProducts,
  getPublicProductBySlug,

  // Legacy temporal
  createMyProduct,
  listMyProducts,
  getMyProductById,
  updateMyProduct,
};