const winston = require('winston')
const config = require('../../config')

// Log levels precedence [error, warn, info, verbose, debug, silly]

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      level: config.get('LOG_LEVEL'),
      handleExceptions: true
    })
  ]
})

// logger.error('log level error registered')
// logger.warn('log level warn registered')
// logger.info('log level info registered')
// logger.verbose('log level verbose registered')
// logger.debug('log level debug registered')
// logger.silly('log level silly registered')

module.exports = logger
