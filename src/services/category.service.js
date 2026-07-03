const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const categoryRepository = require('../repositories/category.repository');
const auditRepository = require('../repositories/audit.repository');

const generateSlug = (text) => {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
};

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
          type: category.parent.type,
          isActive: category.parent.isActive,
        }
      : null,
    children: Array.isArray(category.children)
      ? category.children.map((child) => ({
          id: toStringId(child.id),
          parentId: toStringId(child.parentId),
          name: child.name,
          slug: child.slug,
          type: child.type,
          isActive: child.isActive,
          sortOrder: child.sortOrder,
        }))
      : [],
  };
};

const cleanPayload = (payload) => {
  const data = {};

  if (payload.parentId !== undefined) {
    data.parentId = payload.parentId ? BigInt(payload.parentId) : null;
  }

  if (payload.name !== undefined) {
    data.name = payload.name.trim();
  }

  if (payload.slug !== undefined) {
    data.slug = generateSlug(payload.slug);
  } else if (payload.name !== undefined) {
    data.slug = generateSlug(payload.name);
  }

  if (payload.description !== undefined) {
    data.description = payload.description || null;
  }

  if (payload.iconUrl !== undefined) {
    data.iconUrl = payload.iconUrl || null;
  }

  if (payload.type !== undefined) {
    data.type = payload.type;
  }

  if (payload.sortOrder !== undefined) {
    data.sortOrder = toNumberOrNull(payload.sortOrder);
  }

  if (payload.isActive !== undefined) {
    data.isActive = payload.isActive;
  }

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
  }

  if (type === 'entrepreneur') {
    where.type = {
      in: ['entrepreneur', 'both'],
    };
  }

  if (type === 'both') {
    where.type = 'both';
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
        },
      },
      {
        slug: {
          contains: search,
        },
      },
      {
        description: {
          contains: search,
        },
      },
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
  const data = {
    ...cleanPayload({
      ...payload,
      type: payload.type || 'both',
      isActive: payload.isActive ?? true,
    }),
  };

  const existing = await categoryRepository.findCategoryBySlug(data.slug);

  if (existing) {
    throw new AppError('Ya existe una categoría con ese slug.', 409);
  }

  if (data.parentId) {
    const parent = await categoryRepository.findCategoryById(data.parentId);

    if (!parent) {
      throw new AppError('La categoría padre no existe.', 404);
    }
  }

  const category = await categoryRepository.createCategory(data);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'category',
    entityId: category.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: data,
    description: 'Creación de categoría.',
  });

  return normalizeCategory(category);
};

const updateCategory = async (id, payload, userId, req) => {
  const category = await categoryRepository.findCategoryById(id);

  if (!category) {
    throw new AppError('Categoría no encontrada.', 404);
  }

  const data = cleanPayload(payload);

  if (data.slug && data.slug !== category.slug) {
    const existing = await categoryRepository.findCategoryBySlug(data.slug);

    if (existing) {
      throw new AppError('Ya existe una categoría con ese slug.', 409);
    }
  }

  if (data.parentId && data.parentId.toString() === id.toString()) {
    throw new AppError('Una categoría no puede ser padre de sí misma.', 400);
  }

  const updated = await categoryRepository.updateCategoryById(id, data);

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
    newValues: data,
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
    action: 'update',
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