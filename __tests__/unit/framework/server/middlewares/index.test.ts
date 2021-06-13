import { Middleware } from 'koa'
import logger from '../../../../../src/interfaces/tools/logger'
import app from '../../../../../src/framework/server'
import middlewaresHandler from '../../../../../src/framework/server/middlewares/'
import middlewareConfiguration from '../../../../../src/framework/server/middlewares/config'

describe('ErrorsHandler Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  describe('__getAllActiveMiddlewares inner function test', (): void => {
    it('should get no active middleware if we pass empty configuration', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares({})
      expect(activeMiddlewareModules).toHaveLength(0)
    })

    it('should match all active modules declared on order_configuration file', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares(middlewareConfiguration)
      expect(activeMiddlewareModules.length).toEqual(Object.keys(middlewareConfiguration).length)
      Object.keys(middlewareConfiguration).forEach((element, i): void => {
        expect(activeMiddlewareModules[i].name).toEqual(element)
      })
    })
  })

  describe('register', (): void => {
    it('should not load any module when no active middleware is set', async (): Promise<void> => {
      jest.spyOn(middlewaresHandler, '__getAllActiveMiddlewares').mockImplementation((): [] => [])
      const useSpy = jest.spyOn(app, 'use')

      await middlewaresHandler.register(app)
      expect(useSpy).not.toBeCalled()
    })

    it('should load all active middleware modules discovered', async (): Promise<void> => {
      type middlewareModule = Promise<{ default: Middleware }>
      const dummyMiddlewareModule: middlewareModule = new Promise((resolve): void =>
        resolve({ default: async (ctx, next): Promise<void> => await next() }),
      )
      jest.spyOn(middlewaresHandler, '__getAllActiveMiddlewares').mockImplementation((): {
        name: string
        middlewareModule: middlewareModule
      }[] => [
        {
          name: 'module1',
          middlewareModule: dummyMiddlewareModule,
        },
        {
          name: 'module2',
          middlewareModule: dummyMiddlewareModule,
        },
      ])
      const useSpy = jest.spyOn(app, 'use')

      await middlewaresHandler.register(app)
      expect(useSpy).toBeCalledTimes(2)
    })
  })
})
