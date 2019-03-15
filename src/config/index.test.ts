process.env.PORT = '2211'
import config from './index'

describe('Configuration client test', () => {
  it('should pass the test', () => {
    const port: number = parseInt(config.get('PORT'), 10)
    expect(port).toBe(2211)    
  });
});