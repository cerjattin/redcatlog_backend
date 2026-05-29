const { prisma } = require('../config/prisma');

const createApprovalLog = async (data) => {
  return prisma.approvalLog.create({
    data,
  });
};

module.exports = {
  createApprovalLog,
};
