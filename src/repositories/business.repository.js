const createLegacyBusinessError = () => {
  const error = new Error(
    'El módulo de negocios/emprendimientos fue desactivado. En REDMUEMMA los productos pertenecen directamente a una emprendedora.'
  );

  error.statusCode = 410;
  error.code = 'BUSINESSES_MODULE_DISABLED';

  return error;
};

const disabledBusinessRepositoryMethod = async () => {
  throw createLegacyBusinessError();
};

const findBusinessById = disabledBusinessRepositoryMethod;

const findBusinessBySlug = disabledBusinessRepositoryMethod;

const findBusinessesByEntrepreneurId = disabledBusinessRepositoryMethod;

const findBusinessByEntrepreneurId = disabledBusinessRepositoryMethod;

const createBusiness = disabledBusinessRepositoryMethod;

const updateBusinessById = disabledBusinessRepositoryMethod;

const listBusinesses = disabledBusinessRepositoryMethod;

const countBusinesses = disabledBusinessRepositoryMethod;

module.exports = {
  findBusinessById,
  findBusinessBySlug,
  findBusinessesByEntrepreneurId,
  findBusinessByEntrepreneurId,
  createBusiness,
  updateBusinessById,
  listBusinesses,
  countBusinesses,
};