import sinon from 'sinon'
import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '@src/utils/logger'
import errorsHandler from './index'

const sandbox = sinon.createSandbox()

describe('ErrorsHandler Middeware', (): void => {
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

  it('should capture an error thrown from inside any call process', async (done): Promise<void> => {
    const errorMsg = 'DUMMY_ERROR'
    const mockedContext = createMockContext()
    mockedContext.app.emit = sandbox.stub()

    await errorsHandler(mockedContext, sandbox.stub().rejects(new Error(errorMsg)))
    expect(mockedContext.status).toEqual(500)
    expect(mockedContext.body).toEqual(errorMsg)
    done()
  })
})
