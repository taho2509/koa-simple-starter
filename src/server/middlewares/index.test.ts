import sinon from 'sinon'
import logger from '@src/utils/logger'
import app from '@src/server'
import middlewaresHandler from './index'
import middlewaresOrder from './order_configuration'
import { Middleware } from 'koa'

const sandbox = sinon.createSandbox()

describe('ErrorsHandler Middeware', (): void => {
  beforeAll(
    (): void => {
      logger.mute()
    },
  )

  afterEach(
    (): void => {
      sandbox.restore()
    },
  )

  afterAll(
    (): void => {
      logger.unmute()
    },
  )

  describe('__getAllActiveMiddlewares inner function test', (): void => {
    it('should get no active middleware if we pass empty configuration', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares({})
      expect(activeMiddlewareModules).toHaveLength(0)
    })

    it('should match all active modules declared on order_configuration file', (): void => {
      const activeMiddlewareModules = middlewaresHandler.__getAllActiveMiddlewares(middlewaresOrder)
      expect(activeMiddlewareModules.length).toEqual(Object.keys(middlewaresOrder).length)
      Object.keys(middlewaresOrder).forEach(
        (element, i): void => {
          expect(activeMiddlewareModules[i].name).toEqual(element)
        },
      )
    })
  })

  describe('register', (): void => {
    it('should not load any module when no active middleware is set', async (done): Promise<void> => {
      sandbox.stub(middlewaresHandler, '__getAllActiveMiddlewares').returns([])
      const appUse = sandbox.spy(app, 'use')

      try {
        await middlewaresHandler.register(app)
        expect(appUse.called).toBeFalsy()
        done()
      } catch (error) {
        done.fail(error)
      }
    })

    it('should load all active middleware modules discovered', async (done): Promise<void> => {
      const dummyMiddlewareModule: Promise<{ default: Middleware }> = new Promise(
        (resolve): void => resolve({ default: async (ctx, next): Promise<void> => await next() }),
      )
      sandbox.stub(middlewaresHandler, '__getAllActiveMiddlewares').returns([
        {
          name: 'module1',
          middlewareModule: dummyMiddlewareModule,
        },
        {
          name: 'module2',
          middlewareModule: dummyMiddlewareModule,
        },
      ])
      const appUse = sandbox.spy(app, 'use')

      try {
        await middlewaresHandler.register(app)
        expect(appUse.calledTwice).toBeTruthy()
        done()
      } catch (error) {
        done.fail(error)
      }
    })
  })
})
