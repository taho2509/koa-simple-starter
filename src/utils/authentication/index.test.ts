import sinon from 'sinon'
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
    const mockedContext = {
      request: {
        headers: {},
      },
      assert: sandbox.stub().callsFake(
        (prop: object, statusCode: number, error: object): void => {
          throw error
        },
      ),
    }

    try {
      // @ts-ignore
      await authenticationMiddleware(mockedContext, sandbox.stub())
      done.fail('This should not happen')
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizeError)
      expect(error.message).toBe('Authorization token not found')
      done()
    }
  })

  it('should pass when authorization hearder is present', async (done): Promise<void> => {
    const mockedContext = {
      request: {
        headers: {
          authorization: 'DUMMY AUTH TOKEN',
        },
      },
      assert: sandbox.stub().callsFake((): void => {}),
    }

    const nextStub = sandbox.stub().callsFake((): Promise<{}> => Promise.resolve({}))

    try {
      // @ts-ignore
      await authenticationMiddleware(mockedContext, nextStub)
      expect(nextStub.called).toBeTruthy()
      done()
    } catch (error) {
      done.fail(error)
    }
  })
})
