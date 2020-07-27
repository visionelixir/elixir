import { ElixirFacade } from '../../vision/Facade'
import { ElixirCollector } from './Collector'

export const CollectorFacade: ElixirCollector = (new ElixirFacade(
  'Collector',
) as unknown) as ElixirCollector
