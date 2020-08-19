import { ElixirLoader } from '../../utils/Loader'
import { Context, VisionElixirEnvironment } from '../../vision/types'
import { ElixirRouter } from './Router'
import { Route, Router as IRouter } from './types'

export const RouterInstance: ElixirRouter = new ElixirRouter()

export default (ctx: Context): void => {
  const {
    Router,
    Loader,
  }: { Router: IRouter; Loader: ElixirLoader } = ctx.elixir.services(
    'Router',
    'Loader',
  )

  loadRoutes(Loader, ctx.elixir.config.services.routeFile, ctx)
  attachRoutes(Router)
}

/**
 * Load Routes
 * Loads the route files from each of the vision services
 */
const loadRoutes = (
  Loader: ElixirLoader,
  routeFile: string,
  ctx: Context,
): void => {
  Loader.runAllServiceFileExports(routeFile, VisionElixirEnvironment.VISION, [
    ctx,
  ])
}

/**
 * Attach Routes
 * Adds the routes into the koa router
 */
const attachRoutes = (router: IRouter): void => {
  const core = router.getCore()

  router.getRoutes().map((route: Route) => {
    // duplicate the array
    const args = route.getMiddleware().slice(0)
    // add the path
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    args.unshift(route.getPath())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    core[route.getMethod()](...args)
  })
}
