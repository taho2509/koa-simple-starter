import sinon from 'sinon'
import { createMockContext } from '@shopify/jest-koa-mocks'
import logger from '@src/utils/logger'
import { authenticationMiddleware } from './index'
import { UnauthorizeError } from '../errors'

const sandbox = sinon.createSandbox()

describe('Authorization Middeware', (): void => {
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

  it('should throw an error when no authorization hearder is present', async (done): Promise<void> => {
    const mockedContext = createMockContext()

    try {
      await authenticationMiddleware(mockedContext, sandbox.stub())
      done.fail('This should not happen')
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizeError)
      expect(error.message).toBe('Authorization token not found')
      done()
    }
  })

  it('should pass when authorization hearder is present', async (done): Promise<void> => {
    const mockedContext = createMockContext({
      headers: {
        authorization: 'DUMMY AUTH TOKEN',
      },
    })

    const nextStub = sandbox.stub().callsFake((): Promise<{}> => Promise.resolve({}))

    try {
      await authenticationMiddleware(mockedContext, nextStub)
      expect(nextStub.called).toBeTruthy()
      done()
    } catch (error) {
      done.fail(error)
    }
  })
})
