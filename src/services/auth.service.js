const crypto = require('crypto');
const { AppError } = require('../utils/app-error.util');
const { hashPassword, comparePassword } = require('../utils/password.util');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt.util');
const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const sessionRepository = require('../repositories/session.repository');

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const normalizeUser = (user) => {
  return {
    id: user.id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    whatsapp: user.whatsapp,
    profilePhotoUrl: user.profilePhotoUrl,
    bio: user.bio,
    city: user.city,
    department: user.department,
    country: user.country,
    status: user.status,
    passwordChangedAt: user.passwordChangedAt,
    forcePasswordChange: user.forcePasswordChange,
    role: user.role
      ? {
          id: user.role.id.toString(),
          name: user.role.name,
        }
      : null,
    entrepreneur: user.entrepreneur
      ? {
          id: user.entrepreneur.id.toString(),
          status: user.entrepreneur.status,
        }
      : null,
  };
};

const buildTokens = async (user, req) => {
  const payload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role?.name,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = hashToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await sessionRepository.createSession({
    userId: user.id,
    refreshTokenHash,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const register = async (payload, req) => {
  const existingUser = await userRepository.findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError('El correo ya está registrado.', 409);
  }

  const role = await roleRepository.findEntrepreneurRole();

  if (!role) {
    throw new AppError('No existe rol de emprendedora en la tabla roles.', 500);
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await userRepository.createUser({
    roleId: role.id,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    passwordHash,
    phone: payload.phone || null,
    whatsapp: payload.whatsapp || null,
    city: payload.city || null,
    department: payload.department || null,
    country: 'Colombia',
    status: 'pending',
  });

  const tokens = await buildTokens(user, req);

  return {
    user: normalizeUser(user),
    tokens,
  };
};

const login = async (payload, req) => {
  const user = await userRepository.findUserByEmail(payload.email);

  if (!user || user.deletedAt) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  if (user.status === 'blocked' || user.status === 'deleted') {
    throw new AppError('Usuario no habilitado para iniciar sesión.', 403);
  }

  const isPasswordValid = await comparePassword(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas.', 401);
  }

  await userRepository.updateLastLogin(user.id);

  const tokens = await buildTokens(user, req);

  return {
    user: normalizeUser(user),
    tokens,
  };
};

const refresh = async (refreshToken, req) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Refresh token inválido o expirado.', 401);
  }

  const refreshTokenHash = hashToken(refreshToken);

  const session = await sessionRepository.findActiveSessionByRefreshTokenHash(refreshTokenHash);

  if (!session) {
    throw new AppError('Sesión no válida o expirada.', 401);
  }

  await sessionRepository.revokeSession(session.id);

  const tokens = await buildTokens(session.user, req);

  return {
    user: normalizeUser(session.user),
    tokens,
    decoded,
  };
};

const logout = async (refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);

  const session = await sessionRepository.findActiveSessionByRefreshTokenHash(refreshTokenHash);

  if (session) {
    await sessionRepository.revokeSession(session.id);
  }

  return true;
};

const getMe = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return normalizeUser(user);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
