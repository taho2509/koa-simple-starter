process.env.LOG_LEVEL = 'debug'
import logger, { formatLog } from '../../../../../src/interfaces/tools/logger/index'
import { TransformableInfo } from 'logform'

describe('Winston logger tests', (): void => {
  beforeEach((): void => {
    logger.level = 'debug'
    logger.silent = false
  })

  it('should get correct message format', (): void => {
    const nowTime = Date.now()
    const msg: TransformableInfo = {
      timestamp: nowTime,
      level: 'info',
      message: 'test msg',
    }

    const resultingMessage = formatLog(msg)
    expect(resultingMessage).toBe(`${nowTime} NO ID info: test msg`)
  })

  it('should unmute the logger', (): void => {
    expect(logger.level).toBe('debug')
    expect(logger.silent).toBeFalsy()

    logger.mute()
    expect(logger.level).toBe('debug')
    expect(logger.silent).toBeTruthy()

    logger.unmute()
    expect(logger.level).toBe('debug')
    expect(logger.silent).toBeFalsy()
  })
})
