const entrepreneurService = require('../services/entrepreneur.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const getBody = (req) => req.validated?.body || req.body || {};
const getQuery = (req) => req.validated?.query || req.query || {};
const getParams = (req) => req.validated?.params || req.params || {};

const createEntrepreneur = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.createEntrepreneur(getBody(req), req);

  return successResponse(res, 'Emprendedora creada correctamente.', result, 201);
});

const listEntrepreneurs = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.listEntrepreneurs(getQuery(req));

  return successResponse(res, 'Emprendedoras obtenidas correctamente.', result);
});

const getEntrepreneurById = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await entrepreneurService.getEntrepreneurById(id);

  return successResponse(res, 'Emprendedora obtenida correctamente.', result);
});

const getEntrepreneurBySlug = asyncHandler(async (req, res) => {
  const { slug } = getParams(req);

  const result = await entrepreneurService.getEntrepreneurBySlug(slug);

  return successResponse(res, 'Emprendedora obtenida correctamente.', result);
});

const updateEntrepreneur = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await entrepreneurService.updateEntrepreneur(id, getBody(req), req);

  return successResponse(res, 'Emprendedora actualizada correctamente.', result);
});

const approveEntrepreneur = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await entrepreneurService.approveEntrepreneur(id, req.user.sub, req);

  return successResponse(res, 'Emprendedora aprobada correctamente.', result);
});

const rejectEntrepreneur = asyncHandler(async (req, res) => {
  const { id } = getParams(req);
  const { rejectionReason } = getBody(req);

  const result = await entrepreneurService.rejectEntrepreneur(
    id,
    req.user.sub,
    rejectionReason,
    req
  );

  return successResponse(res, 'Emprendedora rechazada correctamente.', result);
});

const updateEntrepreneurStatus = asyncHandler(async (req, res) => {
  const { id } = getParams(req);
  const { status } = getBody(req);

  const result = await entrepreneurService.updateEntrepreneurStatus(
    id,
    status,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de emprendedora actualizado correctamente.', result);
});

const updateEntrepreneurFeatured = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await entrepreneurService.updateEntrepreneurFeatured(id, getBody(req), req);

  return successResponse(res, 'Destacado de emprendedora actualizado correctamente.', result);
});

const listPublicEntrepreneurs = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.listPublicEntrepreneurs(getQuery(req));

  return successResponse(res, 'Emprendedoras públicas obtenidas correctamente.', result);
});

const getPublicEntrepreneurById = asyncHandler(async (req, res) => {
  const { id } = getParams(req);

  const result = await entrepreneurService.getPublicEntrepreneurById(id);

  return successResponse(res, 'Emprendedora pública obtenida correctamente.', result);
});

const getPublicEntrepreneurBySlug = asyncHandler(async (req, res) => {
  const { slug } = getParams(req);

  const result = await entrepreneurService.getPublicEntrepreneurBySlug(slug);

  return successResponse(res, 'Emprendedora pública obtenida correctamente.', result);
});

module.exports = {
  createEntrepreneur,
  listEntrepreneurs,
  getEntrepreneurById,
  getEntrepreneurBySlug,
  updateEntrepreneur,
  approveEntrepreneur,
  rejectEntrepreneur,
  updateEntrepreneurStatus,
  updateEntrepreneurFeatured,

  listPublicEntrepreneurs,
  getPublicEntrepreneurById,
  getPublicEntrepreneurBySlug,
};