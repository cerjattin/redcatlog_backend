const path = require('path');

const mediaRepository = require('../repositories/media.repository');
const mediaService = require('../services/media.service');

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');

const uploadGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No se recibió archivo.', 400);
  }

  const fileUrl = path.posix.join('/uploads/gallery', req.file.filename);

  const mediaFile = await mediaRepository.createMediaFile({
    fileUrl,
    fileType: 'image',
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
    title: req.body.title || null,
    description: req.body.description || null,
    altText: req.body.altText || null,
    uploadedBy: BigInt(req.user.sub),
  });

  const galleryItem = await mediaService.addGalleryItem(
    req.params.id,
    {
      mediaFileId: mediaFile.id.toString(),
      title: req.body.title || null,
      caption: req.body.caption || null,
      linkUrl: req.body.linkUrl || null,
      sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : 0,
      isActive: req.body.isActive !== 'false',
    },
    req.user.sub,
    req
  );

  return successResponse(
    res,
    'Imagen cargada y agregada a la galería correctamente.',
    {
      mediaFileId: mediaFile.id.toString(),
      fileUrl,
      galleryItem,
    },
    201
  );
});

module.exports = {
  uploadGalleryItem,
};
