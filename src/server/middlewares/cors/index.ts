import cors from 'koa-cors'
import convert from 'koa-convert'

export default convert(cors())