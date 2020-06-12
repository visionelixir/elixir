import { ElixirEvents, EventDispatcherFacade as EventDispatcher } from '../..'
import { responsePre } from './listeners/ResponsePre'
import { responsePost } from './listeners/ResponsePost'

EventDispatcher.on(ElixirEvents.RESPONSE_PRE, responsePre)
EventDispatcher.on(ElixirEvents.RESPONSE_POST, responsePost)
