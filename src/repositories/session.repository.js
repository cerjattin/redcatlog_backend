const { prisma } = require('../config/prisma');

const createSession = async (data) => {
  return prisma.userSession.create({
    data,
  });
};

const findActiveSessionByRefreshTokenHash = async (refreshTokenHash) => {
  return prisma.userSession.findFirst({
    where: {
      refreshTokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
};

const revokeSession = async (id) => {
  return prisma.userSession.update({
    where: { id },
    data: {
      revokedAt: new Date(),
    },
  });
};

const revokeAllUserSessions = async (userId) => {
  return prisma.userSession.updateMany({
    where: {
      userId: BigInt(userId),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

module.exports = {
  createSession,
  findActiveSessionByRefreshTokenHash,
  revokeSession,
  revokeAllUserSessions,
};
