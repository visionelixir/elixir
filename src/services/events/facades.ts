import { ElixirFacade, EventDispatcher } from '../..'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const EventDispatcherFacade = new ElixirFacade(
  'EventDispatcher',
) as EventDispatcher
