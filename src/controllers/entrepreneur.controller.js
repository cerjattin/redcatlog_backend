const entrepreneurService = require('../services/entrepreneur.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const createMyProfile = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.createMyProfile(req.user.sub, req.validated.body, req);
  return successResponse(res, 'Perfil de emprendedora creado correctamente.', result, 201);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.getMyProfile(req.user.sub);
  return successResponse(res, 'Perfil de emprendedora obtenido correctamente.', result);
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.updateMyProfile(req.user.sub, req.validated.body, req);
  return successResponse(res, 'Perfil de emprendedora actualizado correctamente.', result);
});

const listEntrepreneurs = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.listEntrepreneurs(req.validated.query);
  return successResponse(res, 'Emprendedoras obtenidas correctamente.', result);
});

const getEntrepreneurById = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.getById(req.validated.params.id);
  return successResponse(res, 'Emprendedora obtenida correctamente.', result);
});

const approveEntrepreneur = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.approve(req.validated.params.id, req.user.sub, req);
  return successResponse(res, 'Perfil de emprendedora aprobado correctamente.', result);
});

const rejectEntrepreneur = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.reject(
    req.validated.params.id,
    req.user.sub,
    req.validated.body.rejectionReason,
    req
  );

  return successResponse(res, 'Perfil de emprendedora rechazado correctamente.', result);
});

const updateEntrepreneurStatus = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.updateStatus(
    req.validated.params.id,
    req.validated.body.status,
    req.user.sub,
    req
  );

  return successResponse(res, 'Estado de emprendedora actualizado correctamente.', result);
});

const listPublicEntrepreneurs = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.listPublicEntrepreneurs(req.query);
  return successResponse(res, 'Emprendedoras públicas obtenidas correctamente.', result);
});

const getPublicEntrepreneurById = asyncHandler(async (req, res) => {
  const result = await entrepreneurService.getById(req.params.id);

  if (result.status !== 'approved') {
    return res.status(404).json({
      success: false,
      message: 'Emprendedora no disponible públicamente.',
    });
  }

  return successResponse(res, 'Emprendedora pública obtenida correctamente.', result);
});

module.exports = {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  listEntrepreneurs,
  getEntrepreneurById,
  approveEntrepreneur,
  rejectEntrepreneur,
  updateEntrepreneurStatus,
  listPublicEntrepreneurs,
  getPublicEntrepreneurById,
};
