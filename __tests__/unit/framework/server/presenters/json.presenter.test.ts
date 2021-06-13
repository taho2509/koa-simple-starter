import { Context } from 'koa'
import { createMockContext } from '@shopify/jest-koa-mocks'
import JSONPresenter from '../../../../../src/framework/server/presenters/json.presenter'

describe('Json Presenter', () => {
  let presenter: JSONPresenter
  let ctx: Context
  beforeEach(() => {
    ctx = createMockContext()
    presenter = new JSONPresenter(ctx)
  })

  it('should present the data into Koa body', () => {
    const body = { data: 'DATA' }
    presenter.present(body)
    expect(ctx.body).toBe(body)
  })

  it('should set the Success status into Koa', () => {
    presenter.status('Success')
    expect(ctx.status).toBe(200)
  })

  it('should set the Failed status into Koa', () => {
    presenter.status('Error')
    expect(ctx.status).toBe(500)
  })
})
