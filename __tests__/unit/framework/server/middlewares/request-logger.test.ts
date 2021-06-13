import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import loggerMiddleware from '../../../../../src/framework/server/middlewares/requests-logger'

describe('LoggerMiddleware Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should call logger.info after call is returning', async (): Promise<void> => {
    const mockedContext = createMockContext()
    const loggerSpy = jest.spyOn(logger, 'info')

    await loggerMiddleware(mockedContext, jest.fn())
    expect(loggerSpy).toBeCalled()
  })
})
