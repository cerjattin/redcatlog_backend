const express = require('express');

const galleryUploadController = require('../controllers/gallery-upload.controller');
const { uploadImage } = require('../middlewares/upload.middleware');
const mediaController = require('../controllers/media.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');
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
  roleMiddleware('admin', 'super_admin'),
  validate(createMediaFileSchema),
  mediaController.createMediaFile
);

router.get(
  '/files',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  mediaController.listMediaFiles
);

router.get(
  '/files/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(mediaFileIdParamSchema),
  mediaController.getMediaFileById
);

router.post(
  '/galleries',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(createGallerySchema),
  mediaController.createGallery
);

router.get(
  '/galleries',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  mediaController.listGalleries
);

router.get(
  '/galleries/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(galleryIdParamSchema),
  mediaController.getGalleryById
);

router.put(
  '/galleries/:id',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(galleryIdParamSchema),
  validate(updateGallerySchema),
  mediaController.updateGallery
);

router.post(
  '/galleries/:id/items/upload',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(galleryIdParamSchema),
  uploadImage.single('image'),
  galleryUploadController.uploadGalleryItem
);

router.delete(
  '/galleries/:id/items/:itemId',
  authMiddleware,
  roleMiddleware('admin', 'super_admin'),
  validate(deleteGalleryItemSchema),
  mediaController.deleteGalleryItem
);

module.exports = router;
