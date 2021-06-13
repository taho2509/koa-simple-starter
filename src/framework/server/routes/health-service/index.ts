import { Middleware } from 'koa'
import HealthController from '../../../../interfaces/controllers/health'
import JSONPresenter from '../../presenters/json.presenter'

const healthService: Middleware = async (ctx): Promise<void> => {
  await new HealthController(new JSONPresenter(ctx)).get()
}

export default healthService
