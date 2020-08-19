import { VisionElixirEnvironment } from '../../../vision/types'
import boot from '../boot'
import { ElixirRoute } from '../Route'
import { RouterMethods } from '../types'

const Loader = {
  runAllServiceFileExports: jest.fn()
}

const Core = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
}

const Router = {
  getRoutes: () => [
    new ElixirRoute(RouterMethods.GET, '/', []),
    new ElixirRoute(RouterMethods.POST, '/', []),
    new ElixirRoute(RouterMethods.PUT, '/', []),
  ],
  getCore: () => Core
}

const ctx = {
  elixir: {
    services: () => ({
      Router,
      Loader
    }),
    config: {
      services: {
        routeFile: 'routes'
      }
    }
  }
} as any

describe('Router: Boot', () => {
  it ('configures the router', () => {
    boot(ctx)

    expect(Loader.runAllServiceFileExports).toBeCalledTimes(1)
    expect(Loader.runAllServiceFileExports).toBeCalledWith('routes', VisionElixirEnvironment.VISION, [ctx])

    expect(Core.get).toBeCalledTimes(1)
    expect(Core.put).toBeCalledTimes(1)
    expect(Core.post).toBeCalledTimes(1)
  })
})