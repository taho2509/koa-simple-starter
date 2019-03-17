import fs from 'fs'
import path, { dirname } from 'path'
import { Middleware } from 'koa';
import Router from 'koa-router'
import logger from '../utils/logger'
import { CustomApp } from '../server'

export interface Route {
  method: 'get'| 'post'| 'put'| 'delete',
  path: string,
  controller: Middleware
}

const getFullPath = (f: string) => path.join(__dirname, f)
const isDirectory = (f: string) => fs.lstatSync(f).isDirectory()
const getInnerDirectories = (folder: string) => fs.readdirSync(folder).filter(innerFile => isDirectory(path.join(folder, innerFile)))
const isValidRouteDirectory = (f: string) => {
  return fs.lstatSync(f).isDirectory() && f !== 'controller' && fs.readdirSync(f).indexOf('index.ts') > -1
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
      const router = new Router()
      
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
        .forEach(({ method, path: privatePath, controller }, index) => {
          const fullPath = validRoutes[index]
          const routePath = path.join(
            fullPath.substring(fullPath.indexOf(__dirname) + __dirname.length),
            privatePath
          ).replace(/\\/g, '/')
          router[method](routePath , controller)
          logger.verbose(`Registered route [${method.toUpperCase()}] ${routePath}`)
        })
  
      app.use(router.routes())
      app.emit('application:routes:loaded')
      resolve()
    })
  }
}