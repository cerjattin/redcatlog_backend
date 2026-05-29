const { AppError } = require('../utils/app-error.util');
const dashboardRepository = require('../repositories/dashboard.repository');
const entrepreneurRepository = require('../repositories/entrepreneur.repository');

const getAdminOverview = async () => {
  return dashboardRepository.adminOverview();
};

const getEntrepreneurOverview = async (userId) => {
  const entrepreneur = await entrepreneurRepository.findEntrepreneurByUserId(userId);

  if (!entrepreneur) {
    throw new AppError('Perfil emprendedora no encontrado.', 404);
  }

  return dashboardRepository.entrepreneurOverview(entrepreneur.id);
};

module.exports = {
  getAdminOverview,
  getEntrepreneurOverview,
};
