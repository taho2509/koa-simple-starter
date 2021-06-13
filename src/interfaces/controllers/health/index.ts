import HealthUseCase from '../../../domain/interactors/health.use-case'
import { Presenter } from '../../presenter'

export default class HealthController {
  public constructor(private readonly presenter: Presenter) {}

  public async get(): Promise<Presenter> {
    const health = new HealthUseCase()
    const response = await health.execute()

    return this.presenter.present(response).status('Success')
  }
}
