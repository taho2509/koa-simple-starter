import sinon from 'sinon'
import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '@src/utils/logger'
import loggerMiddleware from './index'

const sandbox = sinon.createSandbox()

describe('LoggerMiddleware Middeware', (): void => {
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

  it('should call logger.info after call is returning', async (done): Promise<void> => {
    const mockedContext = createMockContext()
    const loggerSpy = sandbox.spy(logger, 'info')

    await loggerMiddleware(mockedContext, sandbox.stub())
    expect(loggerSpy.called).toEqual(true)
    done()
  })
})
