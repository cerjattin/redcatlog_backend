const { prisma } = require('../config/prisma');

const findRoleByName = async (name) => {
  return prisma.role.findFirst({
    where: {
      name: String(name).toLowerCase(),
    },
  });
};

const findAdminRole = async () => {
  return findRoleByName('admin');
};

const findEditorRole = async () => {
  return findRoleByName('editor');
};

const listRoles = async () => {
  return prisma.role.findMany({
    where: {
      name: {
        in: ['admin', 'editor'],
      },
    },
    orderBy: {
      id: 'asc',
    },
  });
};

module.exports = {
  findRoleByName,
  findAdminRole,
  findEditorRole,
  listRoles,
};