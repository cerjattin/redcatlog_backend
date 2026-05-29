const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { env } = require('../config/env');
const { AppError } = require('../utils/app-error.util');
const userRepository = require('../repositories/user.repository');
const sessionRepository = require('../repositories/session.repository');
const passwordResetRepository = require('../repositories/password-reset.repository');
const auditRepository = require('../repositories/audit.repository');

const RESET_TOKEN_EXPIRES_MINUTES = 30;

const hashPlainToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const adminUpdateUserPassword = async (adminUserId, targetUserId, payload, req) => {
  const targetUser = await userRepository.findUserById(targetUserId);

  if (!targetUser || targetUser.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, 10);

  const updatedUser = await userRepository.updateUserPassword(targetUserId, {
    passwordHash,
    forcePasswordChange: payload.forcePasswordChange ?? true,
  });

  await sessionRepository.revokeAllUserSessions(targetUserId);
  await passwordResetRepository.markUserTokensAsUsed(targetUserId);

  await auditRepository.createAuditLog({
    userId: BigInt(adminUserId),
    action: 'update',
    entityType: 'user',
    entityId: BigInt(targetUserId),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      forcePasswordChange: targetUser.forcePasswordChange,
    },
    newValues: {
      forcePasswordChange: payload.forcePasswordChange ?? true,
    },
    description: 'Administrador actualizó/restableció contraseña de usuario.',
  });

  return {
    id: updatedUser.id.toString(),
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    status: updatedUser.status,
    forcePasswordChange: updatedUser.forcePasswordChange,
    passwordChangedAt: updatedUser.passwordChangedAt,
  };
};

const changeMyPassword = async (userId, payload, req) => {
  const user = await userRepository.findUserById(userId);

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    throw new AppError('La contraseña actual no es correcta.', 401);
  }

  const isSamePassword = await bcrypt.compare(payload.newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new AppError('La nueva contraseña no puede ser igual a la actual.', 409);
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, 10);

  const updatedUser = await userRepository.updateUserPassword(userId, {
    passwordHash,
    forcePasswordChange: false,
  });

  await sessionRepository.revokeAllUserSessions(userId);
  await passwordResetRepository.markUserTokensAsUsed(userId);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'user',
    entityId: BigInt(userId),
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    description: 'Usuario cambió su propia contraseña.',
  });

  return {
    id: updatedUser.id.toString(),
    email: updatedUser.email,
    forcePasswordChange: updatedUser.forcePasswordChange,
    passwordChangedAt: updatedUser.passwordChangedAt,
  };
};

const forgotPassword = async (payload, req) => {
  const user = await userRepository.findUserByEmail(payload.email);

  if (!user || user.deletedAt) {
    return {
      message:
        'Si el correo existe en nuestra plataforma, recibirás instrucciones para restablecer tu contraseña.',
    };
  }

  const rawToken = generateResetToken();
  const tokenHash = hashPlainToken(rawToken);

  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await passwordResetRepository.markUserTokensAsUsed(user.id);

  await passwordResetRepository.createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
  });

  await auditRepository.createAuditLog({
    userId: user.id,
    action: 'create',
    entityType: 'user',
    entityId: user.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    description: 'Solicitud de restablecimiento de contraseña.',
  });

  const response = {
    message:
      'Si el correo existe en nuestra plataforma, recibirás instrucciones para restablecer tu contraseña.',
  };

  /*
   * Beta/local:
   * Mientras no tengamos SMTP conectado, devolvemos el token solo fuera de producción.
   * En producción este token debe enviarse por correo y NO exponerse en la respuesta.
   */
  if (env.NODE_ENV !== 'production') {
    response.resetToken = rawToken;
    response.expiresInMinutes = RESET_TOKEN_EXPIRES_MINUTES;
  }

  return response;
};

const resetPassword = async (payload, req) => {
  const tokenHash = hashPlainToken(payload.token);

  const resetToken = await passwordResetRepository.findValidTokenByHash(tokenHash);

  if (!resetToken) {
    throw new AppError('Token inválido o expirado.', 400);
  }

  const user = resetToken.user;

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const isSamePassword = await bcrypt.compare(payload.newPassword, user.passwordHash);

  if (isSamePassword) {
    throw new AppError('La nueva contraseña no puede ser igual a la actual.', 409);
  }

  const passwordHash = await bcrypt.hash(payload.newPassword, 10);

  const updatedUser = await userRepository.updateUserPassword(user.id, {
    passwordHash,
    forcePasswordChange: false,
  });

  await passwordResetRepository.markTokenAsUsed(resetToken.id);
  await passwordResetRepository.markUserTokensAsUsed(user.id);
  await sessionRepository.revokeAllUserSessions(user.id);

  await auditRepository.createAuditLog({
    userId: user.id,
    action: 'update',
    entityType: 'user',
    entityId: user.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    description: 'Usuario restableció contraseña mediante token.',
  });

  return {
    id: updatedUser.id.toString(),
    email: updatedUser.email,
    passwordChangedAt: updatedUser.passwordChangedAt,
    forcePasswordChange: updatedUser.forcePasswordChange,
  };
};

module.exports = {
  adminUpdateUserPassword,
  changeMyPassword,
  forgotPassword,
  resetPassword,
};
