import { RouterMiddleware } from '../Middleware'

jest.mock('../boot', () => ({
  RouterInstance: {
    getCore: jest.fn(() => ({
      routes: jest.fn(() => ({})),
      allowedMethods: jest.fn(() => ({})),
    }))
  }
}))

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