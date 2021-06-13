import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import correlationalIdMiddleware from '../../../../../src/framework/server/middlewares/correlational-id'

describe('Correlational Id Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should set x-trace header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext()

    await correlationalIdMiddleware(mockedContext, jest.fn())

    expect(mockedContext.response.header).toHaveProperty('x-trace')
  })
})
