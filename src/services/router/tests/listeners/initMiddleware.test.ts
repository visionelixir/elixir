import { initMiddleware } from '../../listeners/initMiddleware'
import * as middleware from '../../Middleware'

const middlewareStackMock = [] as any

const eventMock = {
  getData: () => ({
    middlewareStack: middlewareStackMock
  })
} as any

// @ts-ignore
middleware.RouterMiddleware.attachRoutes = jest.fn()
// @ts-ignore
middleware.RouterMiddleware.allowedMethods = jest.fn()

describe('Router: Listeners: InitMiddleware', () => {
  it ('adds the middleware to the stack', async () => {
    await initMiddleware(eventMock)

    expect(eventMock.getData().middlewareStack).toHaveLength(2)
    expect(middleware.RouterMiddleware.attachRoutes).toBeCalledTimes(1)
    expect(middleware.RouterMiddleware.allowedMethods).toBeCalledTimes(1)
  })
})