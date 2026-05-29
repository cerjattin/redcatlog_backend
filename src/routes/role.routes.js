const express = require('express');

const roleController = require('../controllers/role.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin', 'super_admin'), roleController.listRoles);

module.exports = router;
