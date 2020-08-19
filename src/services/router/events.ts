import { Context, ElixirGlobalEvents, Middleware } from '../../vision/types'
import { Vision } from '../../vision/Vision'
import { ElixirEvent } from '../events/Event'
import { RouterMiddleware } from './Middleware'

export const global = (vision: Vision): void => {
  const emitter = vision.getEmitter()
  emitter.on(
    ElixirGlobalEvents.INIT_MIDDLEWARE,
    async (event: ElixirEvent): Promise<void> => {
      const {
        middlewareStack,
      }: { middlewareStack: Middleware[]; ctx: Context } = event.getData()

      middlewareStack.push(RouterMiddleware.attachRoutes())
      middlewareStack.push(RouterMiddleware.allowedMethods())
    },
  )
}
