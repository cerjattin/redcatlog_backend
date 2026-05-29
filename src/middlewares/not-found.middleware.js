const notFoundMiddleware = (req, res, _next) => {
  return res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};

module.exports = { notFoundMiddleware };
