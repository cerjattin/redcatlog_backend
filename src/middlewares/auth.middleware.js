const { AppError } = require('../utils/app-error.util');
const { verifyAccessToken } = require('../utils/jwt.util');

const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autorización requerido.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError('Token inválido o expirado.', 401));
  }
};

module.exports = { authMiddleware };
