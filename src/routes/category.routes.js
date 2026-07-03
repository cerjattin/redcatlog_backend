const express = require('express');

const categoryController = require('../controllers/category.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOrEditor } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesSchema,
  categoryIdParamSchema,
  updateCategoryStatusSchema,
} = require('../schemas/category.schema');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(listCategoriesSchema),
  categoryController.listCategories
);

router.get(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(categoryIdParamSchema),
  categoryController.getCategoryById
);

router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.patch(
  '/:id/status',
  authMiddleware,
  adminOrEditor,
  validate(updateCategoryStatusSchema),
  categoryController.updateCategoryStatus
);

module.exports = router;