const logger = require('../../../utils/logger')

module.exports = async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  logger.info(`${ctx.method} ${ctx.url} - ${rt}`)
}
