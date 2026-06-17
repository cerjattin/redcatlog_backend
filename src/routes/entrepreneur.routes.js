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
  rejectEntrepreneurSchema,
  updateEntrepreneurStatusSchema,
} = require('../schemas/entrepreneur.schema');

const router = express.Router();

router.get(
  '/me/status',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  entrepreneurController.getMyEntrepreneurStatus
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(createEntrepreneurSchema),
  entrepreneurController.createMyProfile
);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  entrepreneurController.getMyProfile
);

router.put(
  '/me',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  validate(updateEntrepreneurSchema),
  entrepreneurController.updateMyProfile
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(listEntrepreneursSchema),
  entrepreneurController.listEntrepreneurs
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(entrepreneurIdParamSchema),
  entrepreneurController.getEntrepreneurById
);

router.patch(
  '/:id/approve',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(entrepreneurIdParamSchema),
  entrepreneurController.approveEntrepreneur
);

router.patch(
  '/:id/reject',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(rejectEntrepreneurSchema),
  entrepreneurController.rejectEntrepreneur
);

router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(updateEntrepreneurStatusSchema),
  entrepreneurController.updateEntrepreneurStatus
);

module.exports = router;
