import { Middleware } from "koa";

const pingMiddleware:Middleware = async ctx => {
  ctx.body = 'pong'
}

export default pingMiddleware
