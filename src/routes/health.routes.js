const express = require('express');

const healthController = require('../controllers/health.controller');

const router = express.Router();

router.get('/', healthController.health);
router.get('/db', healthController.dbHealth);

module.exports = router;
