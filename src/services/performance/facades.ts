import { ElixirFacade } from '../../vision/Facade'
import { Performance } from './types'

export const PerformanceFacade = (new ElixirFacade(
  'Performance',
) as unknown) as Performance
