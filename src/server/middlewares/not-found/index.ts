import { Middleware } from 'koa'
import { NotFoundError } from '../../../utils/errors'

const notFoundHandler: Middleware = async (ctx, next): Promise<void> => {
  await next()
  if (ctx.res.statusCode === 404) {
    ctx.status = 404
    ctx.body = {
      error: new NotFoundError(ctx.request.url, 'route', {
        url: ctx.request.url,
        method: ctx.request.method,
      }).toJSON(),
    }
  }
}

export default notFoundHandler
