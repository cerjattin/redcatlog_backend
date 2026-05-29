const { AppError } = require('../utils/app-error.util');

const validate = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      }));

      return next(new AppError('Error de validación', 400, errors));
    }

    req.validated = {
      ...(req.validated || {}),
      ...result.data,
      body: {
        ...(req.validated?.body || {}),
        ...(result.data.body || {}),
      },
      params: {
        ...(req.validated?.params || {}),
        ...(result.data.params || {}),
      },
      query: {
        ...(req.validated?.query || {}),
        ...(result.data.query || {}),
      },
    };

    return next();
  };
};

module.exports = { validate };
