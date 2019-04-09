import { Middleware } from 'koa'
import logger from '../../../utils/logger'
import { NotFoundError } from '../../../utils/errors';

const notFoundHandler: Middleware = async (ctx, next) => {
	await next()
	if (ctx.res.statusCode === 404) {
		ctx.status = 404;
		ctx.body = { error: new NotFoundError(ctx.request.url, 'route', {
			url: ctx.request.url,
			method: ctx.request.method
		}).toJSON() }
	}
}

export default notFoundHandler
