const express = require('express');

const roleController = require('../controllers/role.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

const router = express.Router();

router.get('/', authMiddleware, adminOnly, roleController.listRoles);

module.exports = router;