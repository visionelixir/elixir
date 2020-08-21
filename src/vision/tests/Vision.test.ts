import { VisionError } from '../../services/errorHandler/VisionError'
import { ElixirEmitter } from '../../services/events/Emitter'
import { TEST_VISION_CONFIG } from '../../test/fixtures/vision/config'
import { ELIXIR_CONFIG } from '../config'
import { Core, VisionElixirEnvironment } from '../types'
import { Vision } from '../Vision'

jest.mock('../../utils/Loader', require('../../utils/mocks/Loader').ElixirLoaderMock)
jest.mock('../../services/logger/Logger', require('../../services/logger/mocks/Logger').LoggerMock)

beforeEach(jest.clearAllMocks)

describe('Vision: Vision', () => {
  it ('can be instantiated', () => {
    const visionCreateOriginal = Vision.prototype.create
    Vision.prototype.create = jest.fn(() => new Promise(resolve => {
      resolve(true)
    })) as any

    const vision = new Vision()

    expect(vision).toBeInstanceOf(Vision)
    expect(vision.create).toBeCalledTimes(0)
    expect(vision.getCore()).toBeInstanceOf(Core)

    Vision.prototype.create = visionCreateOriginal
  })

  it ('calls create if a config is passed', () => {
    const visionCreateOriginal = Vision.prototype.create
    Vision.prototype.create = jest.fn(() => new Promise(resolve => {
      resolve(true)
    })) as any

    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision).toBeInstanceOf(Vision)
    expect(vision.create).toBeCalledTimes(1)
    expect(vision.getCore()).toBeInstanceOf(Core)

    Vision.prototype.create = visionCreateOriginal
  })

  it ('can set itself up', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision).toBeInstanceOf(Vision)

    expect(vision.getLoader().runAllServiceFileExports).toBeCalledTimes(4)

    expect(vision.getLoader().runAllServiceFileExports).toHaveBeenCalledWith('boot', VisionElixirEnvironment.ELIXIR, [vision], 'global')
    expect(vision.getLoader().runAllServiceFileExports).toHaveBeenCalledWith('boot', VisionElixirEnvironment.VISION, [vision], 'global')
    expect(vision.getLoader().runAllServiceFileExports).toHaveBeenCalledWith('events', VisionElixirEnvironment.ELIXIR, [vision], 'global')
    expect(vision.getLoader().runAllServiceFileExports).toHaveBeenCalledWith('events', VisionElixirEnvironment.VISION, [vision], 'global')
  })

  it ('can return the koa core', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getCore()).toBeInstanceOf(Core)
  })

  it ('can return the config', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getConfig()).toBe(TEST_VISION_CONFIG)
  })

  it ('can return the config by scope', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getConfig(VisionElixirEnvironment.VISION)).toBe(TEST_VISION_CONFIG)
    expect(vision.getConfig(VisionElixirEnvironment.ELIXIR)).toBe(ELIXIR_CONFIG)
  })

  it ('can return the emitter', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getEmitter()).toBeInstanceOf(ElixirEmitter)
  })

  it ('can return the loader', () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getLoader()).toBe(vision['loader'])
  })

  it ('can serve', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    await vision.up()

    expect(vision.getStatus()).toBe(true)

    await vision.down()
  })

  it ('errors if there is no config when serving', async () => {
    const vision = new Vision()

    await expect(vision.up()).rejects.toThrowError(VisionError)
  })

  it ('can get the status', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    expect(vision.getStatus()).toEqual(false)

    await vision.up()

    expect(vision.getStatus()).toEqual(true)

    await vision.down()

    expect(vision.getStatus()).toEqual(false)
  })

  it ('errors if there is an error when calling down', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    await vision.up()

    const originalClose = vision['server'].close
    vision['server'].close = jest.fn((callback: any) => callback(new Error('test error')))

    await expect(vision.down()).rejects.toThrowError(Error)

    vision['server'].close = originalClose
    await vision.down()
  })

  it ('logs if there is an error serving', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    const loggerSpy = jest.spyOn(vision['logger'], 'error')

    await vision.up()

    vision['server'].emit('error', new Error('failed'))

    expect(loggerSpy).toBeCalledTimes(1)

    await vision.down()
  })

})
