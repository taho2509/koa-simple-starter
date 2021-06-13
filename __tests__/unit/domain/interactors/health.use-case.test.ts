import HealthUseCase from '../../../../src/domain/interactors/health.use-case'

describe('Health use case', (): void => {
  let healthInteractor: HealthUseCase

  beforeEach((): void => {
    healthInteractor = new HealthUseCase()
  })

  it('should works', async (): Promise<void> => {
    const response = await healthInteractor.execute()
    expect(response).toStrictEqual({ message: 'The API is healthy' })
  })
})
