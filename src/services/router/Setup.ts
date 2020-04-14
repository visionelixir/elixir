import {
  AssetLoader,
  ElixirRouter,
  Route,
  Vision,
  VisionElixirEnvironment,
} from '../..'

export default class RouterSetup {
  /**
   * Run
   * Automagically run at startup by the
   */
  public run(vision: Vision): void {
    const container = vision.getContainer()
    const router = new ElixirRouter()

    container.singleton('Router', router)

    this.loadRoutes().attachRoutes(router)
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
    router.getRoutes().map((route: Route) => {
      const args = route.getMiddleware().slice(0)
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      args.unshift(route.getPath())
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      router.getCore()[route.getMethod()](this.koaRouter, ...args)
    })

    return this
  }
}
