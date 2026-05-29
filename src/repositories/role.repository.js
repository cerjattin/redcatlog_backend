const { prisma } = require('../config/prisma');

const findRoleByName = async (name) => {
  return prisma.role.findFirst({
    where: {
      name,
    },
  });
};

const findEntrepreneurRole = async () => {
  return prisma.role.findFirst({
    where: {
      OR: [
        { name: 'entrepreneur' },
        { name: 'ENTREPRENEUR' },
        { name: 'emprendedora' },
        { name: 'EMPRENDEDORA' },
      ],
    },
  });
};

const listRoles = async () => {
  return prisma.role.findMany({
    orderBy: {
      id: 'asc',
    },
  });
};

module.exports = {
  findRoleByName,
  findEntrepreneurRole,
  listRoles,
};
