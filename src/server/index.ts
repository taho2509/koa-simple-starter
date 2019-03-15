import Koa from 'koa'
import config from '../config'
import logger from '../utils/logger'

export class CustomApp extends Koa {
  boot() {
    const MiddlewaresHandler = import('./middlewares')
    MiddlewaresHandler.then(module => {
      const { default:middlewaresHandler } = module
      middlewaresHandler.register(this)
    })
  
    logger.info('Application booting process ended.')
  }

  init() {
    const PORT = parseInt(config.get('PORT').toString(), 10) || 8080
    this.listen(PORT)
    logger.info(`Server started on port: ${PORT}`)
  }
}
