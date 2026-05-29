const path = require('path');

const mediaRepository = require('../repositories/media.repository');

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');
const { UPLOAD_FOLDERS } = require('../constants/upload.constants');

const uploadSingleImage = asyncHandler(async (req, res) => {
  const folder = req.params.folder;

  if (!Object.values(UPLOAD_FOLDERS).includes(folder)) {
    throw new AppError('Carpeta de carga no permitida.', 400);
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
    uploadedBy: BigInt(req.user.sub),
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
    },
    201
  );
});

module.exports = {
  uploadSingleImage,
};
