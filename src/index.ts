import app from './server'

process.on('uncaughtException', e => {
  console.log(e)
  process.exit(1)
})
process.on('unhandledRejection', e => {
  console.log(e)
  process.exit(1)
})

app.boot()
app.on('application:booted', app.init)
