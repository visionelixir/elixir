import { ElixirEvents, EventDispatcherFacade as EventDispatcher } from '../..'
import { initMiddleware } from './listeners/initMiddleware'

EventDispatcher.on(ElixirEvents.INIT_MIDDLEWARE, initMiddleware)
