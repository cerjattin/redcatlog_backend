const multer = require('multer');
const path = require('path');

const { env } = require('../config/env');
const { AppError } = require('../utils/app-error.util');
const { ensureDirectoryExists, sanitizeFileName } = require('../utils/file.util');

const {
  ALLOWED_IMAGE_MIME_TYPES,
  UPLOAD_FOLDERS,
} = require('../constants/upload.constants');

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const resolveUploadFolder = (req) => {
  /**
   * Ruta genérica:
   * POST /api/uploads/images/:folder
   */
  if (req.params.folder) {
    return req.params.folder;
  }

  /**
   * Ruta directa de productos:
   * POST /api/products/:id/images/upload
   *
   * Esta ruta no trae req.params.folder, por eso usamos products
   * como carpeta por defecto.
   */
  if (req.originalUrl && req.originalUrl.includes('/api/products/')) {
    return UPLOAD_FOLDERS.products;
  }

  return null;
};

const validateUploadFolder = (folder) => {
  const allowedFolders = Object.values(UPLOAD_FOLDERS);

  if (!folder || !allowedFolders.includes(folder)) {
    throw new AppError(
      `Carpeta de carga no permitida. Usa una de estas: ${allowedFolders.join(', ')}.`,
      400
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    try {
      const folder = resolveUploadFolder(req);

      validateUploadFolder(folder);

      req.uploadFolder = folder;

      const uploadPath = path.join(process.cwd(), env.UPLOADS_DIR, folder);

      ensureDirectoryExists(uploadPath);

      return cb(null, uploadPath);
    } catch (error) {
      return cb(error);
    }
  },

  filename: (_req, file, cb) => {
    const safeOriginalName = sanitizeFileName(file.originalname || 'image');
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    return cb(null, `${uniquePrefix}-${safeOriginalName}`);
  },
});

const imageFileFilter = (_req, file, cb) => {
  const fileExtension = path.extname(file.originalname || '').toLowerCase();

  const isAllowedMimeType = ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype);
  const isAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension);

  /**
   * Debe cumplir ambas condiciones:
   * - MIME válido
   * - extensión válida
   *
   * Antes estaba con &&, eso permitía pasar archivos si solo una condición era válida.
   */
  if (!isAllowedMimeType || !isAllowedExtension) {
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
    fileSize: Number(env.MAX_FILE_SIZE_MB || 3) * 1024 * 1024,
  },
});

module.exports = {
  uploadImage,
};