import { ElixirFacade } from '../../vision/Facade'
import { EventDispatcher } from './types'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const EventDispatcherFacade = new ElixirFacade(
  'EventDispatcher',
) as EventDispatcher
