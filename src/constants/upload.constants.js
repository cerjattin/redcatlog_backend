const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const UPLOAD_FOLDERS = {
  products: 'products',
  entrepreneurs: 'entrepreneurs',
  profiles: 'profiles',
  gallery: 'gallery',
  cms: 'cms',
};

const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 3);

module.exports = {
  ALLOWED_IMAGE_MIME_TYPES,
  UPLOAD_FOLDERS,
  MAX_FILE_SIZE_MB,
};