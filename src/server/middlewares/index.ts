import fs from 'fs'
import path from 'path'
import logger from '../../utils/logger'
import { CustomApp } from '..'
import { Middleware } from 'koa'
import middlewaresOrder from './order_configuration'

export interface MiddlewareHandler {
  register: (app: CustomApp) => Promise<void>
}

const middlewareHandler: MiddlewareHandler = {
  register: (app): Promise<void> => {
    return new Promise(
      async (resolve): Promise<void> => {
        logger.info('Registering middlewares:')

        const defers: { name: string; module: Promise<{ default: Middleware }> }[] = []
        Object.keys(middlewaresOrder).forEach(
          (middlewareFolder): void => {
            const middlewarePath = path.join(__dirname, middlewareFolder)
            const stats = fs.lstatSync(middlewarePath)
            if (stats.isDirectory() && middlewaresOrder[middlewareFolder].active) {
              defers.push({ name: middlewareFolder, module: import(middlewarePath) })
            }
          },
        )

        const modules = await Promise.all(defers.map((x): Promise<{ default: Middleware }> => x.module))
        modules.forEach(
          (module, index): void => {
            app.use(module.default)
            logger.verbose(`registered "${defers[index].name}"`)
          },
        )

        resolve()
      },
    )
  },
}

export default middlewareHandler
