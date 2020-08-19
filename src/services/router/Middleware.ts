import { Middleware } from '../../vision/types'
import { RouterInstance } from './boot'
import { Router as IRouter } from './types'

export class RouterMiddleware {
  public static attachRoutes(): Middleware {
    const Router: IRouter = RouterInstance
    const loadRoutes = Router.getCore().routes()

    // add a name to the function to make debugging easier
    Object.defineProperty(loadRoutes, 'name', { value: 'loadRoutes' })

    return loadRoutes
  }

  public static allowedMethods(): Middleware {
    const Router: IRouter = RouterInstance
    const allowedMethods = Router.getCore().allowedMethods()

    // add a name to the function to make debugging easier
    Object.defineProperty(allowedMethods, 'name', { value: 'allowedMethods' })

    return allowedMethods
  }
}
