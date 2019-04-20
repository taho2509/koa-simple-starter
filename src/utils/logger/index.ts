import winston, { format, Logger } from 'winston'
import config from '../../config'
import { TransformableInfo } from 'logform'

interface WinstonLogger extends Logger {
  mute: () => void
  unmute: () => void
}

export const formatLog = (info: TransformableInfo): string => `${info.timestamp} ${info.level}: ${info.message}`

// Log levels precedence [error, warn, info, verbose, debug, silly]
const logger: Logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: format.combine(format.timestamp(), format.align(), format.colorize(), format.printf(formatLog)),
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

const appLogger = logger as WinstonLogger
appLogger.mute = function(): void {
  this.level = 'none'
}
appLogger.unmute = function(): void {
  this.level = config.get('LOG_LEVEL').toString()
}

export default appLogger
