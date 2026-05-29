const { AppError } = require('../utils/app-error.util');
const { toStringId } = require('../utils/bigint-json.util');
const cmsRepository = require('../repositories/cms.repository');
const auditRepository = require('../repositories/audit.repository');

const normalizeSection = (section) => ({
  id: toStringId(section.id),
  pageId: toStringId(section.pageId),
  sectionKey: section.sectionKey,
  title: section.title,
  subtitle: section.subtitle,
  content: section.content,
  imageUrl: section.imageUrl,
  buttonLabel: section.buttonLabel,
  buttonUrl: section.buttonUrl,
  sortOrder: section.sortOrder,
  status: section.status,
  createdAt: section.createdAt,
  updatedAt: section.updatedAt,
});

const normalizePage = (page) => ({
  id: toStringId(page.id),
  title: page.title,
  slug: page.slug,
  metaTitle: page.metaTitle,
  metaDescription: page.metaDescription,
  status: page.status,
  publishedAt: page.publishedAt,
  createdAt: page.createdAt,
  updatedAt: page.updatedAt,
  sections: page.sections ? page.sections.map(normalizeSection) : [],
});

const cleanPagePayload = (payload) => {
  const data = {
    title: payload.title,
    slug: payload.slug,
    metaTitle: payload.metaTitle,
    metaDescription: payload.metaDescription,
    status: payload.status || 'draft',
    publishedAt: payload.publishedAt ? new Date(payload.publishedAt) : undefined,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const cleanSectionPayload = (payload) => {
  const data = {
    sectionKey: payload.sectionKey,
    title: payload.title,
    subtitle: payload.subtitle,
    content: payload.content,
    imageUrl: payload.imageUrl,
    buttonLabel: payload.buttonLabel,
    buttonUrl: payload.buttonUrl,
    sortOrder: payload.sortOrder,
    status: payload.status || 'draft',
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  return data;
};

const listPages = async () => {
  const pages = await cmsRepository.listPages();
  return pages.map(normalizePage);
};

const getPageById = async (id) => {
  const page = await cmsRepository.findPageById(id);

  if (!page) {
    throw new AppError('Página CMS no encontrada.', 404);
  }

  return normalizePage(page);
};

const getPublicPageBySlug = async (slug) => {
  const page = await cmsRepository.findPageBySlug(slug);

  if (!page || page.status !== 'published') {
    throw new AppError('Página CMS no disponible públicamente.', 404);
  }

  const onlyPublishedSections = {
    ...page,
    sections: page.sections.filter((section) => section.status === 'published'),
  };

  return normalizePage(onlyPublishedSections);
};

const createPage = async (payload, userId, req) => {
  const existing = await cmsRepository.findPageBySlug(payload.slug);

  if (existing) {
    throw new AppError('Ya existe una página con ese slug.', 409);
  }

  const data = cleanPagePayload(payload);

  if (data.status === 'published' && !data.publishedAt) {
    data.publishedAt = new Date();
  }

  const page = await cmsRepository.createPage(data);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'cms_page',
    entityId: page.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de página CMS.',
  });

  return normalizePage(page);
};

const updatePage = async (id, payload, userId, req) => {
  const page = await cmsRepository.findPageById(id);

  if (!page) {
    throw new AppError('Página CMS no encontrada.', 404);
  }

  if (payload.slug && payload.slug !== page.slug) {
    const existing = await cmsRepository.findPageBySlug(payload.slug);

    if (existing) {
      throw new AppError('Ya existe una página con ese slug.', 409);
    }
  }

  const data = cleanPagePayload(payload);

  if (data.status === 'published' && !data.publishedAt && !page.publishedAt) {
    data.publishedAt = new Date();
  }

  const updated = await cmsRepository.updatePageById(id, data);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'cms_page',
    entityId: page.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      title: page.title,
      slug: page.slug,
      status: page.status,
    },
    newValues: payload,
    description: 'Actualización de página CMS.',
  });

  return normalizePage(updated);
};

const createSection = async (pageId, payload, userId, req) => {
  const page = await cmsRepository.findPageById(pageId);

  if (!page) {
    throw new AppError('Página CMS no encontrada.', 404);
  }

  const section = await cmsRepository.createSection({
    pageId: BigInt(pageId),
    ...cleanSectionPayload(payload),
  });

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'create',
    entityType: 'cms_section',
    entityId: section.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    newValues: payload,
    description: 'Creación de sección CMS.',
  });

  return normalizeSection(section);
};

const updateSection = async (id, payload, userId, req) => {
  const section = await cmsRepository.findSectionById(id);

  if (!section) {
    throw new AppError('Sección CMS no encontrada.', 404);
  }

  const updated = await cmsRepository.updateSectionById(id, cleanSectionPayload(payload));

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'update',
    entityType: 'cms_section',
    entityId: section.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      sectionKey: section.sectionKey,
      status: section.status,
    },
    newValues: payload,
    description: 'Actualización de sección CMS.',
  });

  return normalizeSection(updated);
};

const deleteSection = async (id, userId, req) => {
  const section = await cmsRepository.findSectionById(id);

  if (!section) {
    throw new AppError('Sección CMS no encontrada.', 404);
  }

  await cmsRepository.deleteSectionById(id);

  await auditRepository.createAuditLog({
    userId: BigInt(userId),
    action: 'delete',
    entityType: 'cms_section',
    entityId: section.id,
    ipAddress: req.ip || null,
    userAgent: req.headers['user-agent'] || null,
    oldValues: {
      sectionKey: section.sectionKey,
      pageId: toStringId(section.pageId),
    },
    description: 'Eliminación de sección CMS.',
  });

  return true;
};

module.exports = {
  listPages,
  getPageById,
  getPublicPageBySlug,
  createPage,
  updatePage,
  createSection,
  updateSection,
  deleteSection,
};
