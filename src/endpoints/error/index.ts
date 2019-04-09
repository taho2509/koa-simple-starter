import { Route } from '..'

const route: Route = {
  method: 'get',
  path: '',
  controller: (ctx): void => {
    ctx.throw(400, new Error('Dummy error message'))
  },
}

export default route
