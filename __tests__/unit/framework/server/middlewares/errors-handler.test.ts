import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import errorsHandler from '../../../../../src/framework/server/middlewares/errors-handler'

describe('ErrorsHandler Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should capture an error thrown from inside any call process', async (): Promise<void> => {
    const errorMsg = 'DUMMY_ERROR'
    const mockedContext = createMockContext()
    mockedContext.app.emit = jest.fn()

    await errorsHandler(
      mockedContext,
      (): Promise<void> =>
        new Promise((res, rej): void => {
          rej(new Error(errorMsg))
        }),
    )
    expect(mockedContext.status).toEqual(500)
    expect((mockedContext.body as any).message).toEqual(errorMsg)
  })
})
