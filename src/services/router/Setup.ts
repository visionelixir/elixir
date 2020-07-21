import { AssetLoader } from '../../utils/AssetLoader'
import { ElixirRouter } from './Router'
import { Route } from './types'
import { Vision } from '../../vision/Vision'
import { VisionElixirEnvironment } from '../../vision/types'

export default class RouterSetup {
  /**
   * Run
   * Automagically run at startup
   */
  public run(vision: Vision): void {
    const router = new ElixirRouter()

    this.registerContainer(router, vision)
    this.loadRoutes().attachRoutes(router)
  }

  protected registerContainer(router: ElixirRouter, vision: Vision): void {
    const container = vision.getContainer()

    container.singleton('Router', router)
  }

  /**
   * Load Routes
   * Loads the route files from each of the vision services
   */
  protected loadRoutes = (): RouterSetup => {
    AssetLoader.loadAllServiceRoutes(VisionElixirEnvironment.VISION)

    return this
  }

  /**
   * Attach Routes
   * Adds the routes into the koa router
   */
  protected attachRoutes = (router: ElixirRouter): RouterSetup => {
    const core = router.getCore()

    router.getRoutes().map((route: Route) => {
      // duplicate the array
      const args = route.getMiddleware().slice(0)
      // add the path
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      args.unshift(route.getPath())
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      core[route.getMethod()](...args)
    })

    return this
  }
}
