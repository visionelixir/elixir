import { Middleware, RouterFacade as Router } from '../../..'

export class RouterMiddleware {
  public static attachRoutes(): Middleware {
    const loadRoutes = Router.getCore().routes()

    // add a name to the function to make debugging easier
    Object.defineProperty(loadRoutes, 'name', { value: 'loadRoutes' })

    return loadRoutes
  }

  public static allowedMethods(): Middleware {
    const allowedMethods = Router.getCore().allowedMethods()

    // add a name to the function to make debugging easier
    Object.defineProperty(allowedMethods, 'name', { value: 'allowedMethods' })

    return allowedMethods
  }
}
