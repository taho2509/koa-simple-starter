import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import authenticationMiddleware from '../../../../../src/framework/server/middlewares/authentication-errors-handler'

describe('AuthenticationError Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  afterEach((): void => {
    jest.resetAllMocks()
  })

  it('should call logger.error after call throws', async (): Promise<void> => {
    const mockedContext = createMockContext()
    const loggerSpy = jest.spyOn(logger, 'error')

    await authenticationMiddleware(mockedContext, jest.fn().mockRejectedValue({ status: 401 }))
    expect(loggerSpy).toBeCalled()
  })

  it('should ignore error if not 401', async (): Promise<void> => {
    const mockedContext = createMockContext()
    const loggerSpy = jest.spyOn(logger, 'error')

    await authenticationMiddleware(mockedContext, jest.fn().mockRejectedValue({ status: 400 }))
    expect(loggerSpy).not.toBeCalled()
  })
})
