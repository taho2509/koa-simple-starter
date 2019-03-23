import fs from 'fs'
import path from 'path'
import { Middleware } from 'koa'
import logger from '../utils/logger'
import { CustomApp } from '../server'

export interface Route {
  method: 'get'| 'post'| 'put'| 'delete',
  path: string,
  preMiddlewares?: Middleware[],
  controller: Middleware
}

const getFullPath = (f: string) => path.join(__dirname, f)
const isDirectory = (f: string) => fs.lstatSync(f).isDirectory()
const getInnerDirectories = (folder: string) => fs.readdirSync(folder).filter(innerFile => isDirectory(path.join(folder, innerFile)))
const isValidRouteDirectory = (f: string) => {
  const hasIndexFile = (folder: string) => fs.readdirSync(folder).indexOf('index.ts') > -1 || fs.readdirSync(folder).indexOf('index.js') > -1  
  return fs.lstatSync(f).isDirectory() && hasIndexFile(f)
}

const getRoutesTree = (currentPath: string, routes: string[] = []) => {
  if (isDirectory(currentPath)) {
    if (isValidRouteDirectory(currentPath)) {
      routes.push(currentPath)
    }

    getInnerDirectories(currentPath)
      .forEach(innerDir => {
        if (innerDir !== 'controller') {
          getRoutesTree(path.join(currentPath, innerDir), routes)
        }
      })
  }
}

export default {
  setRouter: (app: CustomApp) => {
    return new Promise(async (resolve, reject) => {
      logger.info('Registering routes:')
      
      const validRoutes: string[] = []
      fs.readdirSync(__dirname)
        .map(getFullPath)
        .filter(isDirectory)
        .forEach(filePath => getRoutesTree(filePath, validRoutes))
      
      const defers: Promise<{ default:Route }>[] = []
      validRoutes.forEach(fullPath => defers.push(import(fullPath)))
  
      const routes = await Promise.all(defers)
      routes
        .map(r => r.default)
        .forEach(({ method, path: privatePath, controller, preMiddlewares = []}, index) => {
          const fullPath = validRoutes[index]
          const routePath = path.join(
            fullPath.substring(fullPath.indexOf(__dirname) + __dirname.length),
            privatePath
          ).replace(/\\/g, '/')
          
          // Register route on router
          app.context.router[method](routePath, ...preMiddlewares, controller)
          logger.verbose(`Registered route [${method.toUpperCase()}] ${routePath}`)
        })
  
      app.use(app.context.router.routes())
      app.emit('application:routes:loaded')
      resolve()
    })
  }
}