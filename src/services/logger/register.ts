import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { ElixirLogger } from './Logger'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('Logger', new ElixirLogger())
}
