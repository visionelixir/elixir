import { ElixirEvents } from '../../vision/types'
import { EventDispatcherFacade as EventDispatcher } from '../events/facades'
import { responsePre } from './listeners/ResponsePre'
import { responsePost } from './listeners/ResponsePost'

EventDispatcher.on(ElixirEvents.RESPONSE_PRE, responsePre)
EventDispatcher.on(ElixirEvents.RESPONSE_POST, responsePost)
