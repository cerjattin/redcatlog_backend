const express = require('express');

const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = express.Router();

router.get(
  '/admin/overview',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  dashboardController.getAdminOverview
);

router.get(
  '/me/overview',
  authMiddleware,
  roleMiddleware('entrepreneur', 'emprendedora'),
  dashboardController.getEntrepreneurOverview
);

module.exports = router;
