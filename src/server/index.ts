import Koa from 'koa'
import config from '../config'
import logger from '../utils/logger'

const AppEvents = {
  APPLICATION_BOOTED: 'application:booted',
  APPLICATION_STARTED: 'application:started',
}

export class CustomApp extends Koa {
  boot() {
    logger.info('Environment variables loaded:')
    config.getAll().forEach((val, key) => logger.info(` - ${key}: ${val}`))

    const MiddlewaresHandler = import('./middlewares')
    MiddlewaresHandler.then(module => {
      const { default:middlewaresHandler } = module
      middlewaresHandler.register(this)
    })
  
    logger.info('Application booting process ended.')

    this.emit(AppEvents.APPLICATION_BOOTED)
  }

  init() {
    const PORT = parseInt(config.get('PORT'), 10) || 8080
    this.listen(PORT)
    logger.info(`Server started on port: ${PORT}`)
    
    this.emit(AppEvents.APPLICATION_STARTED)
  }
}
