import { Middleware } from 'koa'
import logger from '../../../../interfaces/tools/logger'

const errorsHandler: Middleware = async (ctx, next): Promise<void> => {
  try {
    await next()
  } catch (error) {
    if (error.status === 401) {
      ctx.status = 401
      const message = error.originalError ? error.originalError.message : error.message
      ctx.body = { message }

      logger.error(message)
    }
  }
}

export default errorsHandler
