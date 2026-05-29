const express = require('express');

const productController = require('../controllers/product.controller');
const productUploadController = require('../controllers/product-upload.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  productIdParamSchema,
  rejectProductSchema,
  updateProductStatusSchema,
  addProductImageSchema,
  deleteProductImageSchema,
} = require('../schemas/product.schema');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(createProductSchema),
  productController.createMyProduct
);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  productController.listMyProducts
);

router.get(
  '/me/:id',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(productIdParamSchema),
  productController.getMyProductById
);

router.put(
  '/me/:id',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(productIdParamSchema),
  validate(updateProductSchema),
  productController.updateMyProduct
);

router.post(
  '/:id/images/upload',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(productIdParamSchema),
  uploadImage.single('image'),
  productUploadController.uploadProductImage
);

router.post(
  '/:id/images',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(addProductImageSchema),
  productController.addProductImage
);

router.delete(
  '/:id/images/:imageId',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(deleteProductImageSchema),
  productController.deleteProductImage
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(listProductsSchema),
  productController.listProducts
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(productIdParamSchema),
  productController.getProductById
);

router.patch(
  '/:id/approve',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(productIdParamSchema),
  productController.approveProduct
);

router.patch(
  '/:id/reject',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(rejectProductSchema),
  productController.rejectProduct
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(updateProductStatusSchema),
  productController.updateProductStatus
);

module.exports = router;
