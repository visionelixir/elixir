import RouterSetup from '../Setup'
import { ElixirRoute } from '../Route'
import { ElixirRouter } from '../Router'
import { RouterMethods } from '../types'
import { VisionElixirEnvironment } from '../../../vision/types'
import { VisionMock } from '../../../vision/mocks/Vision'
import { AssetLoader } from '../../../utils/AssetLoader'

jest.mock('../../../utils/AssetLoader', require('../../../utils/mocks/AssetLoader').AssetLoaderMock)

const singletonMock = jest.fn()

const visionMock = VisionMock().Vision as any
visionMock.getContainer.mockImplementation(() => ({
  singleton: singletonMock
}))

beforeEach(jest.clearAllMocks)

describe('Router: Setup', () => {
  it ('can instantiate', () => {
    const setup = new RouterSetup()

    expect(setup).toBeInstanceOf(RouterSetup)
  })

  it ('can run', () => {
    const setup = new RouterSetup()

    expect(() => {
      setup.run(visionMock)
    }).not.toThrow()
  })

  it ('registers the container', () => {
    const setup = new RouterSetup()

    setup['registerContainer']({} as ElixirRouter, visionMock)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('Router', expect.anything())
  })

  it ('loads the routes', () => {
    const setup = new RouterSetup()

    setup['loadRoutes']()

    expect(AssetLoader.loadAllServiceRoutes).toBeCalledTimes(1)
    expect(AssetLoader.loadAllServiceRoutes).toBeCalledWith(VisionElixirEnvironment.VISION)
  })

  it ('attaches the routes', () => {
    const setup = new RouterSetup()
    const getMock = jest.fn()
    const postMock = jest.fn()
    const coreMock = jest.fn(() => ({
      get: getMock,
      post: postMock
    }))

    const path = 'path'
    const middleware1 = [() => {}, () => {}]
    const middleware2 = [() => {}, () => {}]

    setup['attachRoutes']({
      getRoutes: () => [
        new ElixirRoute(RouterMethods.GET, path, middleware1),
        new ElixirRoute(RouterMethods.POST, path, middleware2),
      ],
      getCore: coreMock
    } as any)

    expect(coreMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith(path, middleware1[0], middleware1[1])
    expect(postMock).toBeCalledWith(path, middleware2[0], middleware2[1])
  })
})