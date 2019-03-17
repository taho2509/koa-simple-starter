import { Route } from "..";
import healthyCheckController from './controller'

const route: Route = {
  method: 'get',
  path: '',
  controller: async ctx => {
    ctx.status = 200
    ctx.body = {
      ...healthyCheckController.getSoftwareData(ctx.startTime)
    }
  } 
}

export default route