import { Context } from '../../vision/types'
import { RouterInstance } from './boot'

export default (ctx: Context): void => {
  const Container = ctx.elixir.services('Container')

  Container.singleton('Router', RouterInstance)
}
