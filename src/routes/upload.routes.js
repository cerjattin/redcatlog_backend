const express = require('express');

const uploadController = require('../controllers/upload.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOrEditor } = require('../middlewares/role.middleware');
const { uploadImage } = require('../middlewares/upload.middleware');

const router = express.Router();

router.post(
  '/images/:folder',
  authMiddleware,
  adminOrEditor,
  uploadImage.single('image'),
  uploadController.uploadSingleImage
);

module.exports = router;