import { Route } from "..";

const route: Route = {
  method: 'get',
  path: '/ping',
  controller: async ctx => {
    ctx.status = 200
    ctx.body = 'pong'
  } 
}

export default route