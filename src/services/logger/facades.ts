import { ElixirFacade } from '../../vision/Facade'
import { Logger } from './types'

export const LoggerFacade = (new ElixirFacade('Logger') as unknown) as Logger
