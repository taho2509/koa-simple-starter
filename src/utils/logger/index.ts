import winston, { format } from 'winston'
import config from '../../config'

// Log levels precedence [error, warn, info, verbose, debug, silly]
const logger: winston.Logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.align(),
        format.colorize(),
        format.printf((info): string => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
      level: config.get('LOG_LEVEL').toString(),
      handleExceptions: true,
    }),
  ],
})

// logger.error('log level error registered')
// logger.warn('log level warn registered')
// logger.info('log level info registered')
// logger.verbose('log level verbose registered')
// logger.debug('log level debug registered')
// logger.silly('log level silly registered')

export default logger
