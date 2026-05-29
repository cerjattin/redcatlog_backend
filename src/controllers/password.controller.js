const passwordService = require('../services/password.service');
const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');

const adminUpdateUserPassword = asyncHandler(async (req, res) => {
  const result = await passwordService.adminUpdateUserPassword(
    req.user.sub,
    req.validated.params.id,
    req.validated.body,
    req
  );

  return successResponse(res, 'Contraseña de usuario actualizada correctamente.', result);
});

const changeMyPassword = asyncHandler(async (req, res) => {
  const result = await passwordService.changeMyPassword(req.user.sub, req.validated.body, req);

  return successResponse(
    res,
    'Contraseña actualizada correctamente. Por seguridad debes iniciar sesión nuevamente.',
    result
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await passwordService.forgotPassword(req.validated.body, req);

  return successResponse(res, result.message, result);
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await passwordService.resetPassword(req.validated.body, req);

  return successResponse(
    res,
    'Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    result
  );
});

module.exports = {
  adminUpdateUserPassword,
  changeMyPassword,
  forgotPassword,
  resetPassword,
};
