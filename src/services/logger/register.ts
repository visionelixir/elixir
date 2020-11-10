import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { Environment } from '../environment/Environment'
import { ElixirLogger } from './Logger'
import { LogType } from './types'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton(
    'Logger',
    new ElixirLogger(
      Environment.get('LOGGER_TYPE', LogType.CONSOLE) as LogType,
    ),
  )
}
