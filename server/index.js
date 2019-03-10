const Koa = require('koa')
const config = require('../config')

const app = new Koa()

app.boot = () => {
    const Middlewares = require('./middlewares')
    Middlewares.register(app)

    console.log('Application booting process ended.')
}

app.init = () => {
    const PORT = config.get('PORT') || 8080
    app.listen(PORT)
    console.log(`Server started on port: ${PORT}`)
}

module.exports = app;