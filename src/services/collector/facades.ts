import { ElixirFacade } from '../../vision/Facade'
import { ElixirCollector } from './Collector'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const CollectorFacade: ElixirCollector = new ElixirFacade(
  'Collector',
) as ElixirCollector
