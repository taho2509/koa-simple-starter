import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import responseTimeMiddleware from '../../../../../src/framework/server/middlewares/response-time'

describe('ResponseTime Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
    jest.useFakeTimers()
  })

  afterAll((): void => {
    logger.unmute()
    jest.clearAllTimers()
  })

  it('should set x-response-time header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext()
    jest.spyOn(mockedContext, 'set')

    const longExecution = new Promise<void>((res): void => res())

    await responseTimeMiddleware(mockedContext, (): Promise<void> => longExecution)

    expect(mockedContext.set).toHaveBeenCalledWith('X-Response-Time', '0 ms')
  })
})
