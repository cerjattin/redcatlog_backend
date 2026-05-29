const { prisma } = require('../config/prisma');

const createAuditLog = async (data) => {
  return prisma.auditLog.create({
    data,
  });
};

module.exports = {
  createAuditLog,
};
