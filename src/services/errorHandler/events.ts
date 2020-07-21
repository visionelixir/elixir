import { ElixirEvent } from '../events/Event'
import { ElixirEvents } from '../../vision/types'
import { EventDispatcherFacade as EventManager } from '../events/facades'
import { ErrorHandlerMiddleware } from './Middleware'

EventManager.on(ElixirEvents.INIT_MIDDLEWARE, async (event: ElixirEvent) => {
  const { middlewareStack } = event.getData()
  middlewareStack.unshift(ErrorHandlerMiddleware.errorHandler())
})
