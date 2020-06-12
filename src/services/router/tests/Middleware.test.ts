import { RouterMiddleware } from '../Middleware'
import * as elixir from '../../..'

// @ts-ignore
elixir['RouterFacade'] = {
  getCore: () => ({
    allowedMethods: () => () => {},
    routes: () => () => {}
  }),
}

describe('Router: Middleware', () => {
  it ('returns a named function from loadRoutes', () => {
    const attachRoutes = RouterMiddleware.attachRoutes()

    expect(attachRoutes.name).toEqual('loadRoutes')
  })

  it ('returns a named function from allowedMethods', () => {
    const allowedMethods = RouterMiddleware.allowedMethods()

    expect(allowedMethods.name).toEqual('allowedMethods')
  })
})