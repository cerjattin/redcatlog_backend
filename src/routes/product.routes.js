const express = require('express');

const productController = require('../controllers/product.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  rejectProductSchema,
  updateProductStatusSchema,
  updateFeaturedProductSchema,
  addProductImageSchema,
  productImageIdParamSchema,
} = require('../schemas/product.schema');

const router = express.Router();

const adminOrEditor = roleMiddleware('admin', 'editor');

/**
 * Products admin/editor routes
 * Nueva lógica REDMUEMMA:
 * - No existe businessId.
 * - Todo producto pertenece directamente a entrepreneurId.
 */

router.get(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(listProductsQuerySchema),
  productController.listProducts
);

router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createProductSchema),
  productController.createProduct
);

router.get(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(productIdParamSchema),
  productController.getProductById
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateProductSchema),
  productController.updateProduct
);

router.patch(
  '/:id/approve',
  authMiddleware,
  adminOrEditor,
  validate(productIdParamSchema),
  productController.approveProduct
);

router.patch(
  '/:id/reject',
  authMiddleware,
  adminOrEditor,
  validate(rejectProductSchema),
  productController.rejectProduct
);

router.patch(
  '/:id/status',
  authMiddleware,
  adminOrEditor,
  validate(updateProductStatusSchema),
  productController.updateProductStatus
);

router.patch(
  '/:id/featured',
  authMiddleware,
  adminOrEditor,
  validate(updateFeaturedProductSchema),
  productController.updateProductFeatured
);

/**
 * Product images
 */

router.post(
  '/:id/images/upload',
  authMiddleware,
  adminOrEditor,
  validate(productIdParamSchema),
  uploadImage.single('image'),
  productController.uploadProductImage
);

router.post(
  '/:id/images',
  authMiddleware,
  adminOrEditor,
  validate(addProductImageSchema),
  productController.addProductImage
);

router.patch(
  '/:id/images/:imageId/main',
  authMiddleware,
  adminOrEditor,
  validate(productImageIdParamSchema),
  productController.setMainProductImage
);

router.delete(
  '/:id/images/:imageId',
  authMiddleware,
  adminOrEditor,
  validate(productImageIdParamSchema),
  productController.deleteProductImage
);

module.exports = router;