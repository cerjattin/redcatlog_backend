const express = require('express');

const entrepreneurController = require('../controllers/entrepreneur.controller');
const businessController = require('../controllers/business.controller');
const productController = require('../controllers/product.controller');
const categoryController = require('../controllers/category.controller');
const mediaController = require('../controllers/media.controller');
const cmsController = require('../controllers/cms.controller');

const router = express.Router();

router.get('/galleries', mediaController.listPublicGalleries);
router.get('/galleries/:slug', mediaController.getPublicGalleryBySlug);

router.get('/entrepreneurs', entrepreneurController.listPublicEntrepreneurs);
router.get('/entrepreneurs/:id', entrepreneurController.getPublicEntrepreneurById);

router.get('/businesses', businessController.listPublicBusinesses);
router.get('/businesses/:slug', businessController.getPublicBusinessBySlug);

router.get('/products', productController.listPublicProducts);
router.get('/products/:slug', productController.getPublicProductBySlug);

router.get('/categories', categoryController.listPublicCategories);
router.get('/categories/:slug', categoryController.getPublicCategoryBySlug);

router.get('/cms/:slug', cmsController.getPublicPageBySlug);

module.exports = router;
