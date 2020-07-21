import { View } from './types'
import { ElixirFacade } from '../../vision/Facade'

export const ViewFacade = (new ElixirFacade('View') as unknown) as View
