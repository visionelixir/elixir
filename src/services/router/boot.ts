import { ElixirLoader } from '../../utils/Loader'
import { VisionElixirEnvironment } from '../../vision/types'
import { Vision } from '../../vision/Vision'
import { ElixirRouter } from './Router'
import { Route, Router as IRouter } from './types'

export let RouterInstance: ElixirRouter

export const global = (vision: Vision): void => {
  RouterInstance = new ElixirRouter()

  const routeFile = vision.getConfig(VisionElixirEnvironment.ELIXIR).services
    .routeFile

  loadRoutes(vision.getLoader(), routeFile, RouterInstance)
  attachRoutes(RouterInstance)
}

/**
 * Load Routes
 * Loads the route files from each of the vision services
 */
const loadRoutes = (
  Loader: ElixirLoader,
  routeFile: string,
  router: IRouter,
): void => {
  Loader.runAllServiceFileExports(routeFile, VisionElixirEnvironment.VISION, [
    router,
  ])
}

/**
 * Attach Routes
 * Adds the routes into the koa router
 */
const attachRoutes = (router: IRouter): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const core = router.getCore() as any

  router.getRoutes().map((route: Route) => {
    // duplicate the array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any = route.getMiddleware().slice(0)

    // stuff a no-next middleware at the end to patch a bug in koa router
    // that matches multiple routes

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const done = async () => {}

    args.push(done)

    // add the path
    args.unshift(route.getPath())

    core[route.getMethod()](...args)
  })
}
