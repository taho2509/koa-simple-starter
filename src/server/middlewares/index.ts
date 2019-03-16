import fs from 'fs'
import path from 'path'
import logger from '../../utils/logger'
import { CustomApp } from '..';
import { Middleware } from 'koa';

export interface MiddlewareHandler {
  register: (app: CustomApp) => void;
}

const middlewareHandler: MiddlewareHandler = {
  register: (app) => {
    return new Promise(async (resolve, reject) => {
      logger.info('Registering middlewares:')
      let middlewaresConfig: { [s: string]: { active: boolean } } = {}
      try {
        middlewaresConfig = JSON.parse(
          fs.readFileSync(path.join(__dirname, 'order_configuration.json'), { encoding: 'utf8' })
        )
      } catch (error) {
        throw new Error('"order_configuration.json" file no found.')
      }
  
      const defers: {name: string, module: Promise<{ default: Middleware }>}[] = []
      Object.keys(middlewaresConfig)
        .forEach(middlewareFolder => {
          const middlewarePath = path.join(__dirname, middlewareFolder)
          const stats = fs.lstatSync(middlewarePath)
          if (stats.isDirectory() && middlewaresConfig[middlewareFolder].active) {
            defers.push({ name: middlewareFolder, module: import(middlewarePath)})
          }
        })
      
      const modules = await Promise.all(defers.map(x => x.module))
      modules.forEach((module, index) => {
        app.use(module.default)
        logger.verbose(`registered "${defers[index].name}"`)
      })
      
      resolve()
    })
  }
}

export default middlewareHandler
