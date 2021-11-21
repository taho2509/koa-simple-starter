import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '../../../../../src/interfaces/tools/logger'
import correlationalIdMiddleware from '../../../../../src/framework/server/middlewares/correlational-id'

jest.mock('uuid', () => {
  return {
    v4: () => 'abcd',
  }
})
describe('Correlational Id Middeware', (): void => {
  beforeAll((): void => {
    logger.mute()
  })

  afterAll((): void => {
    logger.unmute()
  })

  it('should set x-trace header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext({
      headers: {
        'x-trace': '1234',
      },
    })
    jest.spyOn(mockedContext, 'set')

    await correlationalIdMiddleware(mockedContext, jest.fn())

    expect(mockedContext.set).toHaveBeenCalledWith('x-trace', '1234')
  })

  it('should generate x-trace header on response after call', async (): Promise<void> => {
    const mockedContext = createMockContext()
    jest.spyOn(mockedContext, 'set')

    await correlationalIdMiddleware(mockedContext, jest.fn())

    expect(mockedContext.set).toHaveBeenCalledWith('x-trace', 'abcd')
  })
})
