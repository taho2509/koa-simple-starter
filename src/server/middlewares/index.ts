import { Middleware } from 'koa'
import { CustomApp } from '..'
import logger from '@src/utils/logger'
import { isDirectory, getFullPath } from '@src/utils/functions'
import middlewaresOrder, { MiddlewaresOrder } from './order_configuration'

export interface MiddlewareModule {
  name: string
  middlewareModule: Promise<{ default: Middleware }>
}

export interface MiddlewareHandler {
  __getAllActiveMiddlewares: (middlewaresOrder: MiddlewaresOrder) => MiddlewareModule[]
  register: (app: CustomApp) => Promise<void>
}

const middlewaresHandler: MiddlewareHandler = {
  __getAllActiveMiddlewares: (middlewaresOrder): MiddlewareModule[] => {
    const activeMiddlewares: MiddlewareModule[] = []

    Object.keys(middlewaresOrder).forEach(
      (middlewareFolder): void => {
        const middlewarePath = getFullPath(__dirname, middlewareFolder)
        if (isDirectory(middlewarePath) && middlewaresOrder[middlewareFolder].active) {
          activeMiddlewares.push({ name: middlewareFolder, middlewareModule: import(middlewarePath) })
        }
      },
    )

    return activeMiddlewares
  },

  register: (app): Promise<void> => {
    return new Promise(
      async (resolve, reject): Promise<void> => {
        logger.info('Registering middlewares:')
        const defers = middlewaresHandler.__getAllActiveMiddlewares(middlewaresOrder)

        try {
          const middlewares = await Promise.all(defers.map((x): Promise<{ default: Middleware }> => x.middlewareModule))
          middlewares.forEach(
            (middleware, index): void => {
              app.use(middleware.default)
              logger.verbose(`registered "${defers[index].name}"`)
            },
          )
        } catch (error) {
          reject(error)
        }

        resolve()
      },
    )
  },
}

export default middlewaresHandler
