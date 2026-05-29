const path = require('path');

const cmsService = require('../services/cms.service');
const mediaRepository = require('../repositories/media.repository');

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');

const uploadCmsSectionImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No se recibió archivo.', 400);
  }

  const fileUrl = path.posix.join('/uploads/cms', req.file.filename);

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

  const section = await cmsService.updateSection(
    req.params.id,
    {
      imageUrl: fileUrl,
    },
    req.user.sub,
    req
  );

  return successResponse(
    res,
    'Imagen CMS cargada y asociada correctamente.',
    {
      mediaFileId: mediaFile.id.toString(),
      fileUrl,
      section,
    },
    201
  );
});

module.exports = {
  uploadCmsSectionImage,
};
