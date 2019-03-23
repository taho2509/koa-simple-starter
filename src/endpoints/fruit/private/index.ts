import { Route } from '../../'
import { UnauthorizeError } from '../../../utils/errors';

const route: Route = {
  path: '',
  method: 'get',
  preMiddlewares: [
    async (ctx, next) => {
      ctx.assert(ctx.request.headers.authorization, 401, new UnauthorizeError('Authorization token not found'))
      await next()
    }
  ],
  controller: ctx => {
    ctx.status = 200
    ctx.body = 'You may pass'
  }
}

export default route