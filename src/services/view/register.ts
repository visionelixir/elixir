import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { ElixirView } from './View'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('View', new ElixirView())
}
