import { Container as IContainer } from '../container/types'
import { ElixirPerformance } from './Performance'
import { Context } from '../../vision/types'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('Performance', new ElixirPerformance())
}
