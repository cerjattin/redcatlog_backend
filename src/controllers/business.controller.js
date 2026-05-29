const businessService = require('../services/business.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const createMyBusiness = asyncHandler(async (req, res) => {
  const result = await businessService.createMyBusiness(req.user.sub, req.validated.body, req);
  return successResponse(res, 'Emprendimiento creado correctamente.', result, 201);
});

const listMyBusinesses = asyncHandler(async (req, res) => {
  const result = await businessService.listMyBusinesses(req.user.sub);
  return successResponse(res, 'Mis emprendimientos obtenidos correctamente.', result);
});

const getMyBusinessById = asyncHandler(async (req, res) => {
  const result = await businessService.getMyBusinessById(req.user.sub, req.validated.params.id);
  return successResponse(res, 'Mi emprendimiento obtenido correctamente.', result);
});

const updateMyBusiness = asyncHandler(async (req, res) => {
  const result = await businessService.updateMyBusiness(
    req.user.sub,
    req.validated.params.id,
    req.validated.body,
    req
  );

  return successResponse(res, 'Emprendimiento actualizado correctamente.', result);
});

const listBusinesses = asyncHandler(async (req, res) => {
  const result = await businessService.listBusinesses(req.validated.query);
  return successResponse(res, 'Emprendimientos obtenidos correctamente.', result);
});

const getBusinessById = asyncHandler(async (req, res) => {
  const result = await businessService.getById(req.validated.params.id);
  return successResponse(res, 'Emprendimiento obtenido correctamente.', result);
});

const approveBusiness = asyncHandler(async (req, res) => {
  const result = await businessService.approve(req.validated.params.id, req.user.sub, req);
  return successResponse(res, 'Emprendimiento aprobado correctamente.', result);
});

const rejectBusiness = asyncHandler(async (req, res) => {
  const result = await businessService.reject(
    req.validated.params.id,
    req.user.sub,
    req.validated.body.rejectionReason,
    req
  );

  return successResponse(res, 'Emprendimiento rechazado correctamente.', result);
});

const updateBusinessStatus = asyncHandler(async (req, res) => {
  const result = await businessService.updateStatus(
    req.validated.params.id,
    req.validated.body.status,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de emprendimiento actualizado correctamente.', result);
});

const listPublicBusinesses = asyncHandler(async (req, res) => {
  const result = await businessService.listPublicBusinesses(req.query);
  return successResponse(res, 'Emprendimientos públicos obtenidos correctamente.', result);
});

const getPublicBusinessBySlug = asyncHandler(async (req, res) => {
  const result = await businessService.getPublicBusinessBySlug(req.params.slug);
  return successResponse(res, 'Emprendimiento público obtenido correctamente.', result);
});

module.exports = {
  createMyBusiness,
  listMyBusinesses,
  getMyBusinessById,
  updateMyBusiness,
  listBusinesses,
  getBusinessById,
  approveBusiness,
  rejectBusiness,
  updateBusinessStatus,
  listPublicBusinesses,
  getPublicBusinessBySlug,
};
