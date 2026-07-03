const express = require('express');

const entrepreneurController = require('../controllers/entrepreneur.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');

const {
  createEntrepreneurSchema,
  updateEntrepreneurSchema,
  listEntrepreneursSchema,
  entrepreneurIdParamSchema,
  entrepreneurSlugParamSchema,
  rejectEntrepreneurSchema,
  updateEntrepreneurStatusSchema,
  updateFeaturedEntrepreneurSchema,
} = require('../schemas/entrepreneur.schema');

const router = express.Router();

const adminOrEditor = roleMiddleware('admin', 'editor');

router.get(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(listEntrepreneursSchema),
  entrepreneurController.listEntrepreneurs
);

router.post(
  '/',
  authMiddleware,
  adminOrEditor,
  validate(createEntrepreneurSchema),
  entrepreneurController.createEntrepreneur
);

router.get(
  '/slug/:slug',
  authMiddleware,
  adminOrEditor,
  validate(entrepreneurSlugParamSchema),
  entrepreneurController.getEntrepreneurBySlug
);

router.get(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(entrepreneurIdParamSchema),
  entrepreneurController.getEntrepreneurById
);

router.put(
  '/:id',
  authMiddleware,
  adminOrEditor,
  validate(updateEntrepreneurSchema),
  entrepreneurController.updateEntrepreneur
);

router.patch(
  '/:id/approve',
  authMiddleware,
  adminOrEditor,
  validate(entrepreneurIdParamSchema),
  entrepreneurController.approveEntrepreneur
);

router.patch(
  '/:id/reject',
  authMiddleware,
  adminOrEditor,
  validate(rejectEntrepreneurSchema),
  entrepreneurController.rejectEntrepreneur
);

router.patch(
  '/:id/status',
  authMiddleware,
  adminOrEditor,
  validate(updateEntrepreneurStatusSchema),
  entrepreneurController.updateEntrepreneurStatus
);

router.patch(
  '/:id/featured',
  authMiddleware,
  adminOrEditor,
  validate(updateFeaturedEntrepreneurSchema),
  entrepreneurController.updateEntrepreneurFeatured
);

module.exports = router;