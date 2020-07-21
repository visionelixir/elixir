import { Vision } from './Vision'
import { ElixirFacade } from '../vision/Facade'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const VisionFacade: Vision = new ElixirFacade('Vision') as Vision
