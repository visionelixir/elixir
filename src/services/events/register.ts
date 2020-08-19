import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { ElixirEmitter } from './Emitter'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('Emitter', new ElixirEmitter())
}
