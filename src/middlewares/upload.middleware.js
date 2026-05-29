const multer = require('multer');
const path = require('path');

const { env } = require('../config/env');
const { AppError } = require('../utils/app-error.util');
const { ensureDirectoryExists, sanitizeFileName } = require('../utils/file.util');
const { ALLOWED_IMAGE_MIME_TYPES } = require('../constants/upload.constants');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = req.params.folder || 'general';
    const uploadPath = path.join(process.cwd(), env.UPLOADS_DIR, folder);

    ensureDirectoryExists(uploadPath);

    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    cb(null, sanitizeFileName(file.originalname));
  },
});

const imageFileFilter = (_req, file, cb) => {
  const fileExtension = path.extname(file.originalname || '').toLowerCase();

  const isAllowedMimeType = ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype);
  const isAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension);

  if (!isAllowedMimeType && !isAllowedExtension) {
    return cb(
      new AppError(
        `Formato de imagen no permitido. Archivo recibido: ${file.originalname}, tipo: ${file.mimetype}. Usa JPG, PNG o WEBP.`,
        400
      )
    );
  }

  return cb(null, true);
};

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});

module.exports = {
  uploadImage,
};
