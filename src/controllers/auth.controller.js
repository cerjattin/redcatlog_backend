const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body, req);
  return successResponse(res, 'Registro realizado correctamente.', result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body, req);
  return successResponse(res, 'Inicio de sesión correcto.', result);
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.validated.body.refreshToken, req);
  return successResponse(res, 'Token renovado correctamente.', result);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return successResponse(res, 'Sesión cerrada correctamente.');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.sub);
  return successResponse(res, 'Perfil autenticado obtenido correctamente.', user);
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
