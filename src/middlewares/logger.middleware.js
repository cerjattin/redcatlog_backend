const morgan = require('morgan');
const { logger } = require('../config/logger');

const stream = {
  write: (message) => {
    logger.http ? logger.http(message.trim()) : logger.info(message.trim());
  },
};

const httpLoggerMiddleware = morgan('combined', {
  stream,
});

module.exports = {
  httpLoggerMiddleware,
};
