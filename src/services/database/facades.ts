import { ElixirFacade } from '../../vision/Facade'
import { DatabaseManager } from './types'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const DatabaseManagerFacade = new ElixirFacade(
  'DatabaseManager',
) as DatabaseManager
