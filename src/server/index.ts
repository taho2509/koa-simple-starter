require('module-alias/register') // sets up the transpilation modules mechanism
import Koa from 'koa'
import Router from 'koa-router'
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
  app.context.router = new Router()
  const { default: routesHandler } = await import('../endpoints')
  await routesHandler.setRouter(app)

  // Loading extensions
  const { default: extensionsHandler } = await import('../extensions')
  await extensionsHandler.register(app)

  logger.info('Application booting process ended.')
  app.emit('application:booted')
}

app.init = () => {
  const PORT = parseInt(config.get('PORT'), 10) || 8080
  app.listen(PORT)
  app.context.startTime = Date.now()
  logger.info(`Server started on port: ${PORT}`)
  
  app.emit('application:started')
}

app.on('error', (err: Error, ctx) => {
  logger.error(err.toString())
  logger.debug(err.stack || '')
})

export default app 


