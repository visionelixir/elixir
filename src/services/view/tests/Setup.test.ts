import ViewSetup from '../Setup'
import * as elixir from '../../..'
import { ElixirView, VisionElixirEnvironment } from '../../..'
import * as nunjucks from 'nunjucks'

beforeEach(jest.clearAllMocks)

const configureSpy = jest.spyOn(nunjucks, 'configure')

// @ts-ignore
elixir.AssetLoader = {
  loadConfig: jest.fn(() => ({
    themesDirectory: 'themes',
    themeFallback: [ 'theme-a', 'theme-b', 'theme-c' ],
    serviceViewDirectory: 'views'
  } as any)),
  getVisionConfig: jest.fn(() => ({
    baseDirectory: 'baseDir',
    services: {
      directory: 'servicesDir',
      require: [ 'service-a', 'service-b' ]
    }
  } as any))
}

const singletonMock = jest.fn()

const visionMock = {
  getContainer: () => ({
    singleton: singletonMock
  })
} as any

describe('View Service: Setup', () => {
  it ('can instantiate', () => {
    const setup = new ViewSetup()

    expect(setup).toBeInstanceOf(ViewSetup)
  })

  it ('can run', () => {
    const setup = new ViewSetup()

    expect(() => {
      setup.run(visionMock)
    }).not.toThrow()
  })

  it ('sorts the view fallback', () => {
    const setup = new ViewSetup()
    const viewFallback = setup.getViewFallback(
      elixir.AssetLoader.getVisionConfig(),
      elixir.AssetLoader.loadConfig(VisionElixirEnvironment.VISION, 'views')
    )

    expect(viewFallback).toEqual([
      'baseDir/themes/theme-a',
      'baseDir/themes/theme-b',
      'baseDir/themes/theme-c',
      'baseDir/servicesDir/service-a/views',
      'baseDir/servicesDir/service-b/views',
    ])
  })

  it ('configures nunjucks', () => {
    const setup = new ViewSetup()

    setup.configureNunjucks([ 'a', 'b', 'c' ])

    expect(configureSpy).toBeCalledTimes(1)
  })

  it ('registers in the container', () => {
    const setup = new ViewSetup()

    setup.registerContainer(visionMock)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('View', expect.any(ElixirView))
  })

  it ('only sets up nunjucks if a view config is found', () => {
    const setup = new ViewSetup()
    const registerSpy = jest.spyOn(setup, 'registerContainer')
    const fallbackSpy = jest.spyOn(setup, 'getViewFallback')
    const nunjucksSpy = jest.spyOn(setup, 'configureNunjucks')

    // @ts-ignore
    elixir.AssetLoader.loadConfig = jest.fn(() => null)

    setup.run(visionMock)

    expect(registerSpy).toBeCalledTimes(1)
    expect(fallbackSpy).not.toBeCalled()
    expect(nunjucksSpy).not.toBeCalled()
  })
})
