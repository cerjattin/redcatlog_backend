const { prisma } = require('../config/prisma');

const createPasswordResetToken = async (data) => {
  return prisma.passwordResetToken.create({
    data,
  });
};

const findValidTokenByHash = async (tokenHash) => {
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
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

const markTokenAsUsed = async (id) => {
  return prisma.passwordResetToken.update({
    where: {
      id,
    },
    data: {
      usedAt: new Date(),
    },
  });
};

const markUserTokensAsUsed = async (userId) => {
  return prisma.passwordResetToken.updateMany({
    where: {
      userId: BigInt(userId),
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });
};

module.exports = {
  createPasswordResetToken,
  findValidTokenByHash,
  markTokenAsUsed,
  markUserTokensAsUsed,
};
