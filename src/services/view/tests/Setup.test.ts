jest.mock('../../../utils/AssetLoader', require('../../../utils/mocks/AssetLoader').AssetLoaderMock)

import ViewSetup from '../Setup'
import * as nunjucks from 'nunjucks'
import { ElixirView } from '../View'
import { VisionElixirEnvironment } from '../../../vision/types'
import { AssetLoader } from '../../../utils/AssetLoader'
import { VisionMock } from '../../../vision/mocks/Vision'

beforeEach(jest.clearAllMocks)

const configureSpy = jest.spyOn(nunjucks, 'configure')

const singletonMock = jest.fn()

const visionMock = VisionMock().Vision as any
visionMock.getContainer.mockImplementation(() => ({
  singleton: singletonMock
}))


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
      AssetLoader.getVisionConfig(),
      AssetLoader.loadConfig(VisionElixirEnvironment.VISION, 'views')
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
    // @ts-ignore
    AssetLoader.loadConfig.mockImplementationOnce(() => null)

    const setup = new ViewSetup()
    const registerSpy = jest.spyOn(setup, 'registerContainer')
    const fallbackSpy = jest.spyOn(setup, 'getViewFallback')
    const nunjucksSpy = jest.spyOn(setup, 'configureNunjucks')

    setup.run(visionMock)

    expect(registerSpy).toBeCalledTimes(1)
    expect(fallbackSpy).not.toBeCalled()
    expect(nunjucksSpy).not.toBeCalled()
  })
})
