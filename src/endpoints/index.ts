import fs from 'fs'
import path from 'path'
import { Middleware } from 'koa'
import { CustomApp } from '@src/server'
import { hasIndexFile, isDirectory, getInnerDirectories, getFullPath } from '@src/utils/functions'
import logger from '@src/utils/logger'
import { authenticationMiddleware } from '@src/utils/authentication'

export interface Route {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  privateRoute?: boolean
  preMiddlewares?: Middleware[]
  controller: Middleware
}

const isValidRouteDirectory = (f: string): boolean => {
  return fs.lstatSync(f).isDirectory() && hasIndexFile(f)
}

const getRoutesTree = (currentPath: string, routes: string[] = []): void => {
  if (isDirectory(currentPath)) {
    if (isValidRouteDirectory(currentPath)) {
      routes.push(currentPath)
    }

    getInnerDirectories(currentPath).forEach(
      (innerDir): void => {
        if (innerDir !== 'controller') {
          getRoutesTree(path.join(currentPath, innerDir), routes)
        }
      },
    )
  }
}

export default {
  setRouter: (app: CustomApp): Promise<void> => {
    return new Promise(
      async (resolve): Promise<void> => {
        logger.info('Registering routes:')

        const validRoutes: string[] = []
        fs.readdirSync(__dirname)
          .map((f): string => getFullPath(__dirname, f))
          .filter(isDirectory)
          .forEach((filePath): void => getRoutesTree(filePath, validRoutes))

        const defers: Promise<{ default: Route }>[] = []
        validRoutes.forEach(
          (fullPath): void => {
            defers.push(import(fullPath))
          },
        )

        const routes = await Promise.all(defers)
        routes
          .map((r): Route => r.default)
          .forEach(
            (route, index): void => {
              const { method, path: privatePath, controller, preMiddlewares = [], privateRoute = false } = route
              const fullPath = validRoutes[index]
              const routePath = path
                .join(fullPath.substring(fullPath.indexOf(__dirname) + __dirname.length), privatePath)
                .replace(/\\/g, '/')

              // Register route on router
              if (privateRoute) {
                preMiddlewares.push(authenticationMiddleware)
              } // register authentication middleware handler
              app.context.router[method](routePath, ...preMiddlewares, controller)
              logger.verbose(`Registered route [${method.toUpperCase()}] ${routePath}`)
            },
          )

        app.use(app.context.router.routes())
        app.emit('application:routes:loaded')
        resolve()
      },
    )
  },
}
