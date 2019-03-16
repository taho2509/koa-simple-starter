import fs from 'fs'
import path from 'path'
import { Middleware } from 'koa';
import Router from 'koa-router'
import logger from '../utils/logger'
import { CustomApp } from '../server'

export interface Route {
  method: 'get'| 'post'| 'put'| 'delete',
  path: string,
  controller: Middleware
}

const isDirectory = (f: string) => fs.lstatSync(f).isDirectory()
const getFullPath = (f: string) => path.join(__dirname, f)

export default {
  setRouter: (app: CustomApp) => {
    return new Promise(async (resolve, reject) => {
      logger.info('Registering routes:')
      const router = new Router()
      
      const defers: Promise<{ default:Route }>[] = []
      fs.readdirSync(__dirname)
        .map(getFullPath)
        .filter(isDirectory)
        .forEach(fullPath => defers.push(import(fullPath)))
  
      const routes = await Promise.all(defers)
      routes
        .map(r => r.default)
        .forEach(({ method, path, controller }) => {
          router[method](path, controller)
          logger.verbose(`Registered route [${method.toUpperCase()}] ${path}`)
        })
  
      app.use(router.routes())
      logger.info('Routes loaded.')
      resolve()
    })
  }
}