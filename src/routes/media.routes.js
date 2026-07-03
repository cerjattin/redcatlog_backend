const express = require('express');

const galleryUploadController = require('../controllers/gallery-upload.controller');
const { uploadImage } = require('../middlewares/upload.middleware');
const mediaController = require('../controllers/media.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createMediaFileSchema,
  createGallerySchema,
  updateGallerySchema,
  galleryIdParamSchema,
  mediaFileIdParamSchema,
  deleteGalleryItemSchema,
} = require('../schemas/media.schema');

const router = express.Router();

router.post(
  '/files',
  authMiddleware,
  adminOnly,
  validate(createMediaFileSchema),
  mediaController.createMediaFile
);

router.get(
  '/files',
  authMiddleware,
  adminOnly,
  mediaController.listMediaFiles
);

router.get(
  '/files/:id',
  authMiddleware,
  adminOnly,
  validate(mediaFileIdParamSchema),
  mediaController.getMediaFileById
);

router.post(
  '/galleries',
  authMiddleware,
  adminOnly,
  validate(createGallerySchema),
  mediaController.createGallery
);

router.get(
  '/galleries',
  authMiddleware,
  adminOnly,
  mediaController.listGalleries
);

router.get(
  '/galleries/:id',
  authMiddleware,
  adminOnly,
  validate(galleryIdParamSchema),
  mediaController.getGalleryById
);

router.put(
  '/galleries/:id',
  authMiddleware,
  adminOnly,
  validate(galleryIdParamSchema),
  validate(updateGallerySchema),
  mediaController.updateGallery
);

router.post(
  '/galleries/:id/items/upload',
  authMiddleware,
  adminOnly,
  validate(galleryIdParamSchema),
  uploadImage.single('image'),
  galleryUploadController.uploadGalleryItem
);

router.delete(
  '/galleries/:id/items/:itemId',
  authMiddleware,
  adminOnly,
  validate(deleteGalleryItemSchema),
  mediaController.deleteGalleryItem
);

module.exports = router;
