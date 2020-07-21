import { Vision } from '../Vision'
import { Core, ElixirContainer, ElixirEvent, ElixirEvents, LoggerFacade, VisionElixirEnvironment } from '../..'
import { TEST_VISION_CONFIG } from '../../test/fixtures/vision/config'
import { VisionError } from '../../services/errorHandler/VisionError'
import { EventDispatcherFacade as EventDispatcher } from '../../services/events/facades'

jest.mock('../../services/logger/facades', require('../../services/logger/mocks/facades').LoggerFacadeMock)
jest.mock('../../services/events/facades', require('../../services/events/mocks/facades').EventDispatcherFacadeMock)
jest.mock('../../utils/AssetLoader', require('../../utils/mocks/AssetLoader').AssetLoaderMock)

jest.mock('../middleware', () => {
  return {
    AppMiddleware: {
      response: jest.fn(() => () => {}),
      attachVars: jest.fn(() => () => {}),
      compress: jest.fn(() => () => {}),
      serveStatic: jest.fn(() => () => {}),
      bodyParser: jest.fn(() => () => {})
    }
  }
})

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
    expect(vision.getContainer()).toBeInstanceOf(ElixirContainer)
    expect(vision.getContainer().getService('VisionConfig')).toBeTruthy()
    expect(vision.getContainer().getService('Vision')).toBeInstanceOf(Object)
    expect(vision.getCore()).toBeInstanceOf(Core)

    Vision.prototype.create = visionCreateOriginal
  })

  it ('auto creates if instantiated with a config', () => {
    const visionCreateOriginal = Vision.prototype.create
    Vision.prototype.create = jest.fn(() => new Promise(resolve => {
      resolve(true)
    })) as any

    const vision = new Vision({} as any)

    expect(vision).toBeInstanceOf(Vision)
    expect(vision.create).toBeCalledTimes(1)

    Vision.prototype.create = visionCreateOriginal
  })

  it ('creates the application', async () => {
    const visionLoadServicesOriginal = Vision.prototype['loadServices']
    const visionConfigureMiddlewareOriginal = Vision.prototype['configureMiddleware']

    Vision.prototype['loadServices'] = jest.fn() as any
    Vision.prototype['configureMiddleware'] = jest.fn() as any

    const vision = new Vision()
    await vision.create({} as any)

    expect(vision.getCore()).toBeDefined()
    expect(vision['loadServices']).toBeCalledTimes(2)
    expect(vision['loadServices']).toBeCalledWith(VisionElixirEnvironment.ELIXIR)
    expect(vision['loadServices']).toBeCalledWith(VisionElixirEnvironment.VISION)
    expect(EventDispatcher.emit).toBeCalledTimes(2)
    expect(EventDispatcher.emit).toBeCalledWith(ElixirEvents.INIT_SERVICE_SETUP_PRE, expect.any(ElixirEvent))
    expect(EventDispatcher.emit).toBeCalledWith(ElixirEvents.INIT_SERVICE_SETUP_POST, expect.any(ElixirEvent))
    expect(vision['configureMiddleware']).toBeCalledTimes(1)

    Vision.prototype['loadServices'] = visionLoadServicesOriginal
    Vision.prototype['configureMiddleware'] = visionConfigureMiddlewareOriginal
  })

  it ('can configure middleware', async () => {
    const coreUse = jest.fn()
    const vision = new Vision()

    vision['getCore'] = () => ({
      use: coreUse
    }) as any

    vision['config'] = {
      baseDirectory: ''
    } as any

    await vision['configureMiddleware']()

    expect(EventDispatcher.emit).toBeCalledTimes(1)
    expect(EventDispatcher.emit).toBeCalledWith(ElixirEvents.INIT_MIDDLEWARE, expect.any(ElixirEvent))
    expect(coreUse).toBeCalledTimes(5)
  })

  it ('can get the container', () => {
    const vision = new Vision()

    const container = vision.getContainer()

    expect(container).toBeInstanceOf(ElixirContainer)
  })

  it ('can get the core', () => {
    const vision = new Vision()

    const core = vision.getCore()

    expect(core).toBeInstanceOf(Core)
  })

  it ('can get the config', () => {
    const config = TEST_VISION_CONFIG
    const vision = new Vision(config)

    const result = vision.getConfig()
    expect(result).toBe(config)
  })

  it ('can serve', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    await vision.up()

    expect(vision.getStatus()).toEqual(true)

    await vision.down()
  })

  it ('errors if there is no config when serving', async () => {
    const vision = new Vision()

    await expect(vision.up()).rejects.toThrowError(VisionError)
  })

  it ('logs if there is an error serving', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    await vision.up()

    vision['server'].emit('error', new Error('failed'))

    expect(LoggerFacade.error).toBeCalledTimes(1)

    await vision.down()
  })

  it ('logs if there is no error serving', async () => {
    const vision = new Vision(TEST_VISION_CONFIG)

    await vision.up()

    expect(LoggerFacade.info).toBeCalledTimes(1)

    await vision.down()
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
  })
})
