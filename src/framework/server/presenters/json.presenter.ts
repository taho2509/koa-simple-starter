import { Context } from 'koa'
import { Presenter, Status } from '../../../interfaces/presenter'

export default class JSONPresenter implements Presenter {
  public constructor(private readonly ctx: Context) {}
  public present(data: object): Presenter {
    this.ctx.body = data
    return this
  }

  public status(status: Status): Presenter {
    this.ctx.status = status === 'Success' ? 200 : 500
    return this
  }
}
