import Koa from 'koa'
import config from '../config'
import logger from '../utils/logger'

export interface CustomApp extends Koa {
  boot: () => void,
  init: () => void
}
const koaApp: Koa = new Koa()
const app = koaApp as CustomApp
app.boot = async () => {
  logger.info('Environment variables loaded:')
  config.getAll().forEach((val, key) => logger.info(` - ${key}: ${val}`))

  // Loading middlewares
  const { default: middlewaresHandler } = await import('./middlewares')
  await middlewaresHandler.register(app)

  // Loading routes
  const { default: routesHandler } = await import('../endpoints')
  await routesHandler.setRouter(app)

  logger.info('Application booting process ended.')
  app.emit('application:booted')
}

app.init = () => {
  const PORT = parseInt(config.get('PORT'), 10) || 8080
  app.listen(PORT)
  logger.info(`Server started on port: ${PORT}`)
  
  app.emit('application:started')
}

export default app 


