const roleRepository = require('../repositories/role.repository');

const normalizeRole = (role) => {
  return {
    id: role.id.toString(),
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

const listRoles = async () => {
  const roles = await roleRepository.listRoles();
  return roles.map(normalizeRole);
};

module.exports = {
  listRoles,
};
