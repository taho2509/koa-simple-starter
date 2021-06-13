import { createMockContext } from '@shopify/jest-koa-mocks'
import healthService from '../../../../../src/framework/server/routes/health-service'

const getMock = jest.fn()
jest.mock('../../../../../src/interfaces/controllers/health', () => {
  return jest.fn().mockImplementation(() => {
    return { get: getMock }
  })
})

describe('Health Service', (): void => {
  it('Should get health', async (): Promise<void> => {
    const mockedContext = createMockContext()

    await healthService(mockedContext, jest.fn())
    expect(getMock).toBeCalled()
  })
})
