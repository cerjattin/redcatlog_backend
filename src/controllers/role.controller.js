const roleService = require('../services/role.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const listRoles = asyncHandler(async (_req, res) => {
  const roles = await roleService.listRoles();
  return successResponse(res, 'Roles obtenidos correctamente.', roles);
});

module.exports = {
  listRoles,
};
