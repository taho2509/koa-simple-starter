import { Route } from '../../'

const route: Route = {
  path: '',
  method: 'get',
  preMiddlewares: [
    async (ctx, next) => {
      ctx.assert(ctx.request.headers.authorization, 401, 'Authorization token not found')
      await next()
    }
  ],
  controller: ctx => {
    ctx.status = 200
    ctx.body = 'You may pass'
  }
}

export default route