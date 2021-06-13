import Interactor from './interactor'

export default class GetHealth implements Interactor {
  public constructor() {}
  public async execute(): Promise<{ message: string }> {
    return { message: 'The API is healthy' }
  }
}
