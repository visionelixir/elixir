import { Vision } from './Vision'
import { ElixirFacade } from '../vision/Facade'

export const VisionFacade: Vision = (new ElixirFacade(
  'Vision',
) as unknown) as Vision
