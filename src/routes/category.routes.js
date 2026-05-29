const express = require('express');

const categoryController = require('../controllers/category.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesSchema,
  categoryIdParamSchema,
  updateCategoryStatusSchema,
} = require('../schemas/category.schema');

const router = express.Router();

const readCategoryRoles = ['admin', 'super_admin', 'entrepreneur', 'emprendedora'];

const writeCategoryRoles = ['admin', 'super_admin'];

router.get(
  '/',
  authMiddleware,
  roleMiddleware(...readCategoryRoles),
  validate(listCategoriesSchema),
  categoryController.listCategories
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(...readCategoryRoles),
  validate(categoryIdParamSchema),
  categoryController.getCategoryById
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(...writeCategoryRoles),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(...writeCategoryRoles),
  validate(categoryIdParamSchema),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware(...writeCategoryRoles),
  validate(updateCategoryStatusSchema),
  categoryController.updateCategoryStatus
);

module.exports = router;
