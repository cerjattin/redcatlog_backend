const userService = require('../services/user.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user.sub);
  return successResponse(res, 'Perfil obtenido correctamente.', user);
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user.sub, req.validated.body);
  return successResponse(res, 'Perfil actualizado correctamente.', user);
});

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.validated.query);
  return successResponse(res, 'Usuarios obtenidos correctamente.', result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.validated.params.id);
  return successResponse(res, 'Usuario obtenido correctamente.', user);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(
    req.validated.params.id,
    req.validated.body.status
  );
  return successResponse(res, 'Estado de usuario actualizado correctamente.', user);
});

module.exports = {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  updateUserStatus,
};
