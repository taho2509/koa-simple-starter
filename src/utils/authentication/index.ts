import { Middleware } from 'koa'
import { UnauthorizeError } from '@src/utils/errors'

export const authenticationMiddleware: Middleware = async (ctx, next) => {
  ctx.assert(ctx.request.headers.authorization, 401, new UnauthorizeError('Authorization token not found'))
  await next()
}
