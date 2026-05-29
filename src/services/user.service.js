const { AppError } = require('../utils/app-error.util');
const userRepository = require('../repositories/user.repository');

const normalizeUser = (user) => {
  if (!user) return null;

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
    emailVerifiedAt: user.emailVerifiedAt,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role
      ? {
          id: user.role.id.toString(),
          name: user.role.name,
          description: user.role.description,
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

const getMe = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return normalizeUser(user);
};

const updateMe = async (userId, payload) => {
  const user = await userRepository.findUserById(userId);

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const allowedData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    whatsapp: payload.whatsapp,
    profilePhotoUrl: payload.profilePhotoUrl,
    bio: payload.bio,
    city: payload.city,
    department: payload.department,
    country: payload.country,
  };

  Object.keys(allowedData).forEach((key) => {
    if (allowedData[key] === undefined) {
      delete allowedData[key];
    }
  });

  const updatedUser = await userRepository.updateUserById(userId, allowedData);

  return normalizeUser(updatedUser);
};

const buildUserWhere = ({ status, role, search }) => {
  const where = {
    deletedAt: null,
  };

  if (status) {
    where.status = status;
  }

  if (role) {
    where.role = {
      name: role,
    };
  }

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
        },
      },
      {
        lastName: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
        },
      },
    ];
  }

  return where;
};

const listUsers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= 100 ? limit : 20;

  const skip = (safePage - 1) * safeLimit;

  const where = buildUserWhere(query);

  const [items, total] = await Promise.all([
    userRepository.listUsers({
      skip,
      take: safeLimit,
      where,
    }),
    userRepository.countUsers(where),
  ]);

  return {
    items: items.map(normalizeUser),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  return normalizeUser(user);
};

const updateUserStatus = async (id, status) => {
  const user = await userRepository.findUserById(id);

  if (!user || user.deletedAt) {
    throw new AppError('Usuario no encontrado.', 404);
  }

  const updatedUser = await userRepository.updateUserById(id, {
    status,
    deletedAt: status === 'deleted' ? new Date() : null,
  });

  return normalizeUser(updatedUser);
};

module.exports = {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  updateUserStatus,
  normalizeUser,
};
