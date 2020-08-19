import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { ElixirCollector } from './Collector'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('Collector', new ElixirCollector())
}
