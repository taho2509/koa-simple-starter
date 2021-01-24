import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../interfaces/tools/logger'
import responseTimeMiddleware from '../response-time/index'

describe('ResponseTime Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should set x-response-time header on response after call', async (done): Promise<void> => {
    const mockFirstDate = 1466424490000
    const mockSecondDate = 1466424490100
    const spy = jest.spyOn(global.Date, 'now').mockReturnValueOnce(mockFirstDate).mockReturnValueOnce(mockSecondDate)

    const mockedContext = createMockContext()

    let longExecution = new Promise<void>((res): void => res())

    await responseTimeMiddleware(mockedContext, (): Promise<void> => longExecution)

    spy.mockRestore()

    expect(mockedContext.response.header).toHaveProperty('x-response-time')
    expect(mockedContext.response.header['x-response-time']).toBe('100 ms')
    done()
  })
})
