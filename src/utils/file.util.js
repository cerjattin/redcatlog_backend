const path = require('path');
const fs = require('fs');

const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {
      recursive: true,
    });
  }
};

const sanitizeFileName = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, ext)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${baseName || 'file'}-${Date.now()}${ext}`;
};

module.exports = {
  ensureDirectoryExists,
  sanitizeFileName,
};
