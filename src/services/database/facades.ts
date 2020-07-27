import { ElixirFacade } from '../../vision/Facade'
import { DatabaseManager } from './types'

export const DatabaseManagerFacade = (new ElixirFacade(
  'DatabaseManager',
) as unknown) as DatabaseManager
