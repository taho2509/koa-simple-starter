import { CustomApp } from './server'

const app = new CustomApp()
app.boot()
app.init()

process.on("uncaughtException", e => {
  console.log(e);
  process.exit(1);
});
process.on("unhandledRejection", e => {
  console.log(e);
  process.exit(1);
});
