const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const categoryRepository = require('../repositories/category.repository');
const auditRepository = require('../repositories/audit.repository');

const normalizeCategory = (category) => {
  if (!category) return null;

  return {
    id: toStringId(category.id),
    parentId: toStringId(category.parentId),
    name: category.name,
    slug: category.slug,
    description: category.description,
    iconUrl: category.iconUrl,
    type: category.type,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    parent: category.parent
      ? {
          id: toStringId(category.parent.id),
          name: category.parent.name,
          slug: category.parent.slug,
        }
      : null,
    children: category.children
      ? category.children.map((child) => ({
          id: toStringId(child.id),
          name: child.name,
          slug: child.slug,
          type: child.type,
          isActive: child.isActive,
        }))
      : [],
  };
};

const cleanPayload = (payload) => {
  const data = {
    parentId: payload.parentId ? BigInt(payload.parentId) : null,
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
    iconUrl: payload.iconUrl,
    type: payload.type || 'both',
    sortOrder: payload.sortOrder,
    isActive: payload.isActive,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const buildWhere = ({ parentId, type, isActive, search }) => {
  const where = {};

  if (parentId !== undefined) {
    where.parentId = parentId === 'null' ? null : BigInt(parentId);
  }

  if (type === 'product') {
    where.type = {
      in: ['product', 'both'],
    };
  } else if (type === 'business') {
    where.type = {
      in: ['business', 'both'],
    };
  } else if (type) {
    where.type = type;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return where;
};

const listCategories = async (query = {}) => {
  const where = buildWhere(query);
  const categories = await categoryRepository.listCategories(where);
  return categories.map(normalizeCategory);
};

const listPublicCategories = async (query = {}) => {
  return listCategories({
    ...query,
    isActive: 'true',
  });
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    throw new AppError('Categoría no encontrada.', 404);
  }

  return normalizeCategory(category);
};

const getCategoryBySlug = async (slug) => {
  const category = await categoryRepository.findCategoryBySlug(slug);

  if (!category || !category.isActive) {
    throw new AppError('Categoría no disponible.', 404);
  }

  return normalizeCategory(category);
};

const createCategory = async (payload, userId, req) => {
  const existing = await categoryRepository.findCategoryBySlug(payload.slug);

  if (existing) {
    throw new AppError('Ya existe una categoría con ese slug.', 409);
  }

  if (payload.parentId) {
    const parent = await categoryRepository.findCategoryById(payload.parentId);

    if (!parent) {
      throw new AppError('La categoría padre no existe.', 404);
    }
  }

  const category = await categoryRepository.createCategory(cleanPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'category',
    entityId: category.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de categoría.',
  });

  return normalizeCategory(category);
};

const updateCategory = async (id, payload, userId, req) => {
  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    throw new AppError('Categoría no encontrada.', 404);
  }

  if (payload.slug && payload.slug !== category.slug) {
    const existing = await categoryRepository.findCategoryBySlug(payload.slug);

    if (existing) {
      throw new AppError('Ya existe una categoría con ese slug.', 409);
    }
  }

  if (payload.parentId && payload.parentId === id) {
    throw new AppError('Una categoría no puede ser padre de sí misma.', 400);
  }

  const updated = await categoryRepository.updateCategoryById(id, cleanPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'category',
    entityId: category.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      name: category.name,
      slug: category.slug,
      type: category.type,
      isActive: category.isActive,
    },
    newValues: payload,
    description: 'Actualización de categoría.',
  });

  return normalizeCategory(updated);
};

const updateCategoryStatus = async (id, isActive, userId, req) => {
  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    throw new AppError('Categoría no encontrada.', 404);
  }

  const updated = await categoryRepository.updateCategoryById(id, {
    isActive,
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'status_change',
    entityType: 'category',
    entityId: category.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      isActive: category.isActive,
    },
    newValues: {
      isActive,
    },
    description: 'Cambio de estado de categoría.',
  });

  return normalizeCategory(updated);
};

module.exports = {
  listCategories,
  listPublicCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  updateCategoryStatus,
};
