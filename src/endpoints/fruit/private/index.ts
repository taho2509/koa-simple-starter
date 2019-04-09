import { Route } from '../../'

const route: Route = {
  path: '',
  method: 'get',
  privateRoute: true,
  preMiddlewares: [],
  controller: (ctx): void => {
    ctx.status = 200
    ctx.body = 'You may pass'
  },
}

export default route
