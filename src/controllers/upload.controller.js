const path = require('path');

const mediaRepository = require('../repositories/media.repository');

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');
const { UPLOAD_FOLDERS } = require('../constants/upload.constants');

const uploadSingleImage = asyncHandler(async (req, res) => {
  const folder = req.uploadFolder || req.params.folder;

  const allowedFolders = Object.values(UPLOAD_FOLDERS);

  if (!folder || !allowedFolders.includes(folder)) {
    throw new AppError(
      `Carpeta de carga no permitida. Usa una de estas: ${allowedFolders.join(', ')}.`,
      400
    );
  }

  if (!req.file) {
    throw new AppError('No se recibió ningún archivo.', 400);
  }

  const fileUrl = path.posix.join('/uploads', folder, req.file.filename);

  const mediaFile = await mediaRepository.createMediaFile({
    fileUrl,
    fileType: 'image',
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
    title: req.body.title || null,
    description: req.body.description || null,
    altText: req.body.altText || null,
    uploadedBy: req.user?.sub ? BigInt(req.user.sub) : null,
  });

  return successResponse(
    res,
    'Imagen cargada correctamente.',
    {
      fileUrl,
      mediaFileId: mediaFile.id.toString(),
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      folder,
    },
    201
  );
});

/**
 * Alias para mantener compatibilidad.
 * Algunas rutas pueden llamar uploadController.uploadSingleImage
 * y otras uploadController.uploadImage.
 */
const uploadImage = uploadSingleImage;

module.exports = {
  uploadSingleImage,
  uploadImage,
};