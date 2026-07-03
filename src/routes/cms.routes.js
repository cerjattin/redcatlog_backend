const express = require('express');

const cmsUploadController = require('../controllers/cms-upload.controller');
const { uploadImage } = require('../middlewares/upload.middleware');
const cmsController = require('../controllers/cms.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createPageSchema,
  updatePageSchema,
  createSectionSchema,
  updateSectionSchema,
  pageIdParamSchema,
  sectionIdParamSchema,
} = require('../schemas/cms.schema');

const router = express.Router();

router.get(
  '/pages',
  authMiddleware,
 adminOnly,
  cmsController.listPages
);

router.get(
  '/pages/:id',
  authMiddleware,
  adminOnly,
  validate(pageIdParamSchema),
  cmsController.getPageById
);

router.post(
  '/pages',
  authMiddleware,
  adminOnly,
  validate(createPageSchema),
  cmsController.createPage
);

router.put(
  '/pages/:id',
  authMiddleware,
  adminOnly,
  validate(pageIdParamSchema),
  validate(updatePageSchema),
  cmsController.updatePage
);

router.post(
  '/pages/:id/sections',
  authMiddleware,
  adminOnly,
  validate(createSectionSchema),
  cmsController.createSection
);

router.post(
  '/sections/:id/image/upload',
  authMiddleware,
  adminOnly,
  validate(sectionIdParamSchema),
  uploadImage.single('image'),
  cmsUploadController.uploadCmsSectionImage
);

router.put(
  '/sections/:id',
  authMiddleware,
  adminOnly,
  validate(updateSectionSchema),
  cmsController.updateSection
);

router.delete(
  '/sections/:id',
  authMiddleware,
  adminOnly,
  validate(sectionIdParamSchema),
  cmsController.deleteSection
);

module.exports = router;
