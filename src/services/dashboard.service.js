const dashboardRepository = require('../repositories/dashboard.repository');

const getAdminOverview = async () => {
  return dashboardRepository.adminOverview();
};

module.exports = {
  getAdminOverview,
};
