process.env.PORT = '8000'
import config from '../../../../../src/interfaces/tools/config/config'

describe('Config Loader', () => {
  it('should get environment vars', () => {
    expect(config.get('PORT')).toBe('8000')
    expect(config.get('NONE')).toBe('')
  })

  it('should get environment all vars', () => {
    expect(config.getAll().get('PORT')).toBe('8000')
    expect(config.getAll().get('NODE_ENV')).toBe('test')
    expect(config.getAll().get('LOG_LEVEL')).toBeUndefined()
  })
})
