import Router from 'koa-router'
import healthService from './health-service'

const router: Router = new Router({
  prefix: '/v1.0.0',
})

router.get('/health', healthService)

export default router
