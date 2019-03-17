import { Route } from '../../../endpoints'
import controller from './controller'

const route: Route = {
  method: 'get',
  path: '/',
  controller: async ctx => {
    const mangos = controller.get()
    ctx.status = 200
    ctx.body = mangos
  }
}

export default route