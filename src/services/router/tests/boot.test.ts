import { mocked } from 'ts-jest/utils'
import { VisionElixirEnvironment } from '../../../vision/types'
import { global as globalBoot } from '../boot'
import { ElixirRoute } from '../Route'
import { ElixirRouter } from '../Router'
import { RouterMethods } from '../types'

jest.mock('../Router', () => ({
  ElixirRouter: jest.fn()
}))

const mockedRouter = mocked(ElixirRouter)
const routerMock = {
  getRoutes: () => [
    new ElixirRoute(RouterMethods.GET, '/', []),
    new ElixirRoute(RouterMethods.POST, '/', []),
    new ElixirRoute(RouterMethods.PUT, '/', []),
  ],
  getCore: () => Core
} as any

mockedRouter.mockImplementation(() => routerMock)

const Loader = {
  runAllServiceFileExports: jest.fn()
}

const Core = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
}

const Vision = {
  getConfig: (() => ({
    services: {
      routeFile: 'routes'
    }
  })),
  getLoader: () => Loader,
} as any

describe('Router: Boot', () => {
  it ('configures the router', () => {
    globalBoot(Vision)

    expect(Loader.runAllServiceFileExports).toBeCalledTimes(1)
    expect(Loader.runAllServiceFileExports).toBeCalledWith('routes', VisionElixirEnvironment.VISION, [ routerMock ])

    expect(Core.get).toBeCalledTimes(1)
    expect(Core.put).toBeCalledTimes(1)
    expect(Core.post).toBeCalledTimes(1)
  })
})