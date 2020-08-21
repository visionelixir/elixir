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
