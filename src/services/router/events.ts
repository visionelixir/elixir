import { ElixirEvents } from '../../vision/types'
import { EventDispatcherFacade as EventDispatcher } from '../events/facades'
import { initMiddleware } from './listeners/initMiddleware'

EventDispatcher.on(ElixirEvents.INIT_MIDDLEWARE, initMiddleware)
