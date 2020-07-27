import { ElixirFacade } from '../../vision/Facade'
import { Router } from './types'

export const RouterFacade = (new ElixirFacade('Router') as unknown) as Router
