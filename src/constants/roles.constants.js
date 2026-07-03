const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
};

const ADMIN_ROLES = [ROLES.ADMIN];

const ADMIN_OR_EDITOR_ROLES = [ROLES.ADMIN, ROLES.EDITOR];

module.exports = {
  ROLES,
  ADMIN_ROLES,
  ADMIN_OR_EDITOR_ROLES,
};