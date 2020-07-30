import { ElixirFacade } from '../../vision/Facade'
import { ElixirConfig } from './Config'

export const ConfigFacade: ElixirConfig = (new ElixirFacade(
  'Config',
) as unknown) as ElixirConfig
