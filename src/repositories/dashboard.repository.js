const { prisma } = require('../config/prisma');

const adminOverview = async () => {
  const [
    totalUsers,
    totalEntrepreneurs,
    totalBusinesses,
    totalProducts,

    pendingEntrepreneurs,
    pendingBusinesses,
    pendingProducts,

    publishedBusinesses,
    publishedProducts,

    featuredBusinesses,
    featuredProducts,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.entrepreneur.count(),

    prisma.business.count(),

    prisma.product.count(),

    prisma.entrepreneur.count({
      where: {
        status: 'pending_review',
      },
    }),

    prisma.business.count({
      where: {
        status: 'pending_review',
      },
    }),

    prisma.product.count({
      where: {
        status: 'pending_review',
      },
    }),

    prisma.business.count({
      where: {
        status: 'published',
      },
    }),

    prisma.product.count({
      where: {
        status: 'published',
      },
    }),

    prisma.business.count({
      where: {
        isFeatured: true,
      },
    }),

    prisma.product.count({
      where: {
        isFeatured: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalEntrepreneurs,
    totalBusinesses,
    totalProducts,

    pendingEntrepreneurs,
    pendingBusinesses,
    pendingProducts,

    publishedBusinesses,
    publishedProducts,

    featuredBusinesses,
    featuredProducts,
  };
};

const entrepreneurOverview = async (entrepreneurId) => {
  const [
    myBusinesses,
    myProducts,

    draftBusinesses,
    publishedBusinesses,

    draftProducts,
    pendingProducts,
    publishedProducts,
  ] = await Promise.all([
    prisma.business.count({
      where: {
        entrepreneurId: BigInt(entrepreneurId),
      },
    }),

    prisma.product.count({
      where: {
        business: {
          entrepreneurId: BigInt(entrepreneurId),
        },
      },
    }),

    prisma.business.count({
      where: {
        entrepreneurId: BigInt(entrepreneurId),
        status: 'draft',
      },
    }),

    prisma.business.count({
      where: {
        entrepreneurId: BigInt(entrepreneurId),
        status: 'published',
      },
    }),

    prisma.product.count({
      where: {
        business: {
          entrepreneurId: BigInt(entrepreneurId),
        },
        status: 'draft',
      },
    }),

    prisma.product.count({
      where: {
        business: {
          entrepreneurId: BigInt(entrepreneurId),
        },
        status: 'pending_review',
      },
    }),

    prisma.product.count({
      where: {
        business: {
          entrepreneurId: BigInt(entrepreneurId),
        },
        status: 'published',
      },
    }),
  ]);

  return {
    myBusinesses,
    myProducts,

    draftBusinesses,
    publishedBusinesses,

    draftProducts,
    pendingProducts,
    publishedProducts,
  };
};

module.exports = {
  adminOverview,
  entrepreneurOverview,
};
