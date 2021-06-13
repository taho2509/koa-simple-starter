import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import notFoundHandler from '../../../../../src/framework/server/middlewares/not-found'

describe('NotFoundHandler Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should return 404 error', async (): Promise<void> => {
    const mockedContext = createMockContext({
      url: '/unexisting-url',
      method: 'GET',
    })

    await notFoundHandler(mockedContext, jest.fn())
    expect(mockedContext.status).toEqual(404)
    expect(mockedContext.body).toHaveProperty('error')
    expect((mockedContext.body as any).error.message).toBe(
      'Resource: http://test.com/unexisting-url of type: route, Not Found',
    )
  })
})
