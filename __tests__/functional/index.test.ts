import supertest from 'supertest'
import '../../src/index'
import app from '../../src/framework/server'

const started = new Promise<void>((resolve) => {
  app.on('application:started', () => {
    resolve()
  })
})

describe('Functional test', (): void => {
  beforeAll(() => {
    return started
  })

  afterAll(async () => {
    await app.stop()
  })

  it('should accept requests', async () => {
    await supertest(app.server)
      .get('/v0.0.1/health')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined()
        expect(body).toStrictEqual({ message: 'The API is healthy' })
      })
  })
})
