import { Container as IContainer } from '../container/types'
import { DatabaseInstance } from './boot'
import { Context } from '../../vision/types'

export default (ctx: Context): void => {
  const Container: IContainer = ctx.elixir.services('Container')

  Container.singleton('Database', DatabaseInstance)
}
