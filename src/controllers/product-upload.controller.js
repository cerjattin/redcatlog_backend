const path = require('path');

const productService = require('../services/product.service');

const { successResponse } = require('../utils/response.util');
const { asyncHandler } = require('../utils/async-handler.util');
const { AppError } = require('../utils/app-error.util');

const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No se recibió archivo.', 400);
  }

  const fileUrl = path.posix.join('/uploads/products', req.file.filename);

  const result = await productService.addImage(req.user.sub, req.params.id, {
    imageUrl: fileUrl,
    altText: req.body.altText || null,

    sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : undefined,

    isMain: req.body.isMain === 'true',
  });

  return successResponse(res, 'Imagen de producto cargada correctamente.', result, 201);
});

module.exports = {
  uploadProductImage,
};
