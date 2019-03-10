const Koa = require('koa')
const config = require('../config')
const logger = require('../utils/logger')

const app = new Koa()

app.boot = () => {
    const Middlewares = require('./middlewares')
    Middlewares.register(app)

    logger.info('Application booting process ended.')
}

app.init = () => {
    const PORT = config.get('PORT') || 8080
    app.listen(PORT)
    logger.info(`Server started on port: ${PORT}`)
}

module.exports = app;