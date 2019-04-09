import { Route } from '..'

const route: Route = {
  method: 'get',
  path: '/',
  controller: (ctx): void => {
    ctx.status = 200
    ctx.body = 'pong'
  },
}

export default route
