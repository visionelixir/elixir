import { Router } from '../../../../..'
import { Context, Next } from 'koa'

const middleware = () => async (_ctx: Context, next: Next) => {
  await next()
}

Router.get('/', [
  middleware()
])
