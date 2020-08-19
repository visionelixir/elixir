import { ElixirLoader } from '../../utils/Loader'
import { Context } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { ElixirConfig } from './Config'

export default (ctx: Context): void => {
  const {
    Container,
    Loader,
  }: { Container: IContainer; Loader: ElixirLoader } = ctx.elixir.services(
    'Container',
    'Loader',
  )

  Container.singleton('Config', new ElixirConfig(Loader))
}
