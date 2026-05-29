const { prisma } = require('../config/prisma');

const baseInclude = {
  role: true,
  entrepreneur: true,
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: baseInclude,
  });
};

const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: BigInt(id) },
    include: baseInclude,
  });
};

const createUser = async (data) => {
  return prisma.user.create({
    data,
    include: {
      role: true,
    },
  });
};

const updateLastLogin = async (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      lastLoginAt: new Date(),
    },
  });
};

const updateUserById = async (id, data) => {
  return prisma.user.update({
    where: { id: BigInt(id) },
    data,
    include: baseInclude,
  });
};

const listUsers = async ({ skip, take, where }) => {
  return prisma.user.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      role: true,
      entrepreneur: true,
    },
  });
};

const countUsers = async (where) => {
  return prisma.user.count({ where });
};

const updateUserPassword = async (id, data) => {
  return prisma.user.update({
    where: {
      id: BigInt(id),
    },
    data: {
      passwordHash: data.passwordHash,
      passwordChangedAt: new Date(),
      forcePasswordChange: data.forcePasswordChange ?? false,
    },
    include: baseInclude,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
  updateUserById,
  listUsers,
  countUsers,
  updateUserPassword,
};
