const { prisma } = require('../config/prisma');

const adminOverview = async () => {
  const [
    totalUsers,
    totalAdmins,
    totalEditors,

    totalEntrepreneurs,
    draftEntrepreneurs,
    pendingEntrepreneurs,
    approvedEntrepreneurs,
    rejectedEntrepreneurs,
    inactiveEntrepreneurs,
    featuredEntrepreneurs,

    totalProducts,
    draftProducts,
    pendingProducts,
    publishedProducts,
    rejectedProducts,
    inactiveProducts,
    featuredProducts,

    totalCategories,
    activeCategories,
    inactiveCategories,

    totalCmsPages,
    publishedCmsPages,

    totalMediaFiles,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        deletedAt: null,
        role: {
          name: 'admin',
        },
      },
    }),

    prisma.user.count({
      where: {
        deletedAt: null,
        role: {
          name: 'editor',
        },
      },
    }),

    prisma.entrepreneur.count(),

    prisma.entrepreneur.count({
      where: {
        status: 'draft',
      },
    }),

    prisma.entrepreneur.count({
      where: {
        status: 'pending_review',
      },
    }),

    prisma.entrepreneur.count({
      where: {
        status: 'approved',
      },
    }),

    prisma.entrepreneur.count({
      where: {
        status: 'rejected',
      },
    }),

    prisma.entrepreneur.count({
      where: {
        status: 'inactive',
      },
    }),

    prisma.entrepreneur.count({
      where: {
        isFeatured: true,
      },
    }),

    prisma.product.count(),

    prisma.product.count({
      where: {
        status: 'draft',
      },
    }),

    prisma.product.count({
      where: {
        status: 'pending_review',
      },
    }),

    prisma.product.count({
      where: {
        status: 'published',
      },
    }),

    prisma.product.count({
      where: {
        status: 'rejected',
      },
    }),

    prisma.product.count({
      where: {
        status: 'inactive',
      },
    }),

    prisma.product.count({
      where: {
        isFeatured: true,
      },
    }),

    prisma.category.count(),

    prisma.category.count({
      where: {
        isActive: true,
      },
    }),

    prisma.category.count({
      where: {
        isActive: false,
      },
    }),

    prisma.cmsPage.count(),

    prisma.cmsPage.count({
      where: {
        status: 'published',
      },
    }),

    prisma.mediaFile.count(),
  ]);

  return {
    users: {
      total: totalUsers,
      admins: totalAdmins,
      editors: totalEditors,
    },

    entrepreneurs: {
      total: totalEntrepreneurs,
      draft: draftEntrepreneurs,
      pending: pendingEntrepreneurs,
      approved: approvedEntrepreneurs,
      rejected: rejectedEntrepreneurs,
      inactive: inactiveEntrepreneurs,
      featured: featuredEntrepreneurs,
    },

    products: {
      total: totalProducts,
      draft: draftProducts,
      pending: pendingProducts,
      published: publishedProducts,
      rejected: rejectedProducts,
      inactive: inactiveProducts,
      featured: featuredProducts,
    },

    categories: {
      total: totalCategories,
      active: activeCategories,
      inactive: inactiveCategories,
    },

    cms: {
      totalPages: totalCmsPages,
      publishedPages: publishedCmsPages,
    },

    media: {
      totalFiles: totalMediaFiles,
    },
  };
};

module.exports = {
  adminOverview,
};