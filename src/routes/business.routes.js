const express = require('express');

const businessController = require('../controllers/business.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createBusinessSchema,
  updateBusinessSchema,
  listBusinessSchema,
  businessIdParamSchema,
  rejectBusinessSchema,
  updateBusinessStatusSchema,
} = require('../schemas/business.schema');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(createBusinessSchema),
  businessController.createMyBusiness
);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  businessController.listMyBusinesses
);

router.get(
  '/me/:id',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(businessIdParamSchema),
  businessController.getMyBusinessById
);

router.put(
  '/me/:id',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(businessIdParamSchema),
  validate(updateBusinessSchema),
  businessController.updateMyBusiness
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(listBusinessSchema),
  businessController.listBusinesses
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(businessIdParamSchema),
  businessController.getBusinessById
);

router.patch(
  '/:id/approve',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(businessIdParamSchema),
  businessController.approveBusiness
);

router.patch(
  '/:id/reject',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(rejectBusinessSchema),
  businessController.rejectBusiness
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(updateBusinessStatusSchema),
  businessController.updateBusinessStatus
);

module.exports = router;
