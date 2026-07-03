const express = require('express');

const productController = require('../controllers/product.controller');
const entrepreneurController = require('../controllers/entrepreneur.controller');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

/**
 * Public REDMUEMMA routes
 * Nueva lógica:
 * - No existen businesses/emprendimientos/marcas/negocios.
 * - Productos pertenecen directamente a una emprendedora.
 * - Categorías clasifican productos y emprendedoras.
 */

router.get(
  '/categories',
  categoryController.listPublicCategories
);

router.get(
  '/categories/:slug',
  categoryController.getPublicCategoryBySlug
);

router.get(
  '/entrepreneurs',
  entrepreneurController.listPublicEntrepreneurs
);

/**
 * Esta ruta debe ir antes de /entrepreneurs/:id
 */
router.get(
  '/entrepreneurs/slug/:slug',
  entrepreneurController.getPublicEntrepreneurBySlug
);

router.get(
  '/entrepreneurs/:id',
  entrepreneurController.getPublicEntrepreneurById
);

router.get(
  '/products',
  productController.listPublicProducts
);

router.get(
  '/products/:slug',
  productController.getPublicProductBySlug
);

module.exports = router;