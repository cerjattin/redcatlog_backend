const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const getAdminOverview = asyncHandler(async (_req, res) => {
  const result = await dashboardService.getAdminOverview();
  return successResponse(res, 'Resumen dashboard administrador obtenido correctamente.', result);
});

const getEntrepreneurOverview = asyncHandler(async (req, res) => {
  const result = await dashboardService.getEntrepreneurOverview(req.user.sub);
  return successResponse(res, 'Resumen dashboard emprendedora obtenido correctamente.', result);
});

module.exports = {
  getAdminOverview,
  getEntrepreneurOverview,
};
