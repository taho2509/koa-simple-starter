import Router from 'koa-router'
import healthService from './health-service'

const router: Router = new Router({
  prefix: '/v0.0.1',
})

router.get('/health', healthService)

export default router
