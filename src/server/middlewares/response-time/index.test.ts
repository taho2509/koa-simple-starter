import sinon from 'sinon'
import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '@src/utils/logger'
import responseTimeMiddleware from './index'

const sandbox = sinon.createSandbox()

describe('ResponseTime Middeware', (): void => {
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

  it('should set x-response-time header on response after call', async (done): Promise<void> => {
    const mockedContext = createMockContext()

    await responseTimeMiddleware(mockedContext, sandbox.stub())
    expect(mockedContext.response.header).toHaveProperty('x-response-time')
    expect(mockedContext.response.header['x-response-time']).toEqual('1ms')
    done()
  })
})
