import { ElixirEvent } from '../../events/Event'
import { RouterMiddleware } from '../Middleware'

export const initMiddleware = async (event: ElixirEvent): Promise<void> => {
  const { middlewareStack } = event.getData()

  middlewareStack.push(RouterMiddleware.attachRoutes())
  middlewareStack.push(RouterMiddleware.allowedMethods())
}
