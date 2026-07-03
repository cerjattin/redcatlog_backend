const express = require('express');

const dashboardController = require('../controllers/dashboard.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  adminOnly,
  dashboardController.getAdminOverview
);

module.exports = router;