import {
  ElixirEvent,
  ElixirEvents,
  EventDispatcherFacade as EventManager,
} from '../..'
import { ErrorHandlerMiddleware } from './Middleware'

EventManager.on(ElixirEvents.INIT_MIDDLEWARE, async (event: ElixirEvent) => {
  const { middlewareStack } = event.getData()
  middlewareStack.unshift(ErrorHandlerMiddleware.errorHandler())
})
