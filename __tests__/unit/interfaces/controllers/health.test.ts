import HealthUseCase from '../../../../src/domain/interactors/health.use-case'
import HealthController from '../../../../src/interfaces/controllers/health'
import { Presenter } from '../../../../src/interfaces/presenter'
jest.mock('../../../../src/domain/interactors/health.use-case')

const mockedHealthUseCase = HealthUseCase as jest.Mock<HealthUseCase>
const mockPresenter: Presenter = {
  present: jest.fn(),
  status: jest.fn(),
}

describe('HealthController', (): void => {
  it('should execute use case and present', async (): Promise<void> => {
    mockPresenter.present = jest.fn().mockReturnValue(mockPresenter)
    mockPresenter.status = jest.fn().mockReturnValue(mockPresenter)

    const response = await new HealthController(mockPresenter).get()

    expect(mockedHealthUseCase).toBeCalled()
    expect(mockPresenter.present).toBeCalled()
    expect(mockPresenter.status).toBeCalledWith('Success')
    expect(response).toBe(mockPresenter)
  })
})
