import app from './server'
import logger from '@src/utils/logger'

process.on(
  'uncaughtException',
  (e: Error): void => {
    logger.error('Uncaugth Exception :', e)
    process.exit(1)
  },
)
process.on(
  'unhandledRejection',
  (reason, p): void => {
    logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
    process.exit(1)
  },
)

app.boot()
app.on('application:booted', app.init)
