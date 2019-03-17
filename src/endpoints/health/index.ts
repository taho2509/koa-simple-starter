import { Route } from "..";

const route: Route = {
  method: 'get',
  path: '',
  controller: async ctx => {
    ctx.status = 200
    ctx.body = {
      date: Date.now(),
      status: 'life'
    }
  } 
}

export default route