import { ElixirFacade } from '../../vision/Facade'
import { EventDispatcher } from './types'

export const EventDispatcherFacade = (new ElixirFacade(
  'EventDispatcher',
) as unknown) as EventDispatcher
