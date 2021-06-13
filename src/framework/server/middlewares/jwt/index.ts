import { Middleware } from 'koa'
import jwt from 'koa-jwt'

const jwtMiddleware: Middleware = jwt({ secret: process.env.APP__JWT_TOKEN as string }).unless({
  path: [/\/health$/],
  method: 'OPTIONS',
})

export default jwtMiddleware
