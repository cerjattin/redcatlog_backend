const { AppError } = require('../utils/app-error.util');
const { ADMIN_ROLES, ADMIN_OR_EDITOR_ROLES } = require('../constants/roles.constants');

const normalizeRoleName = (role) => {
  return String(role || '')
    .trim()
    .toLowerCase();
};

const roleMiddleware = (...allowedRoles) => {
  return (req, _res, next) => {
    const userRole = normalizeRoleName(req.user?.role);
    const normalizedAllowedRoles = allowedRoles.map(normalizeRoleName);

    if (!userRole) {
      return next(new AppError('Rol no encontrado en el token.', 403));
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return next(new AppError('No tienes permisos para acceder a este recurso.', 403));
    }

    return next();
  };
};

const adminOnly = roleMiddleware(...ADMIN_ROLES);

const adminOrEditor = roleMiddleware(...ADMIN_OR_EDITOR_ROLES);

module.exports = {
  roleMiddleware,
  adminOnly,
  adminOrEditor,
  normalizeRoleName,
};