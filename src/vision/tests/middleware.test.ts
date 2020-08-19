import { ElixirContainer } from '../../services/container/Container'
import { TEST_VISION_CONFIG } from '../../test/fixtures/vision/config'
import { ELIXIR_CONFIG } from '../config'
import { AppMiddleware } from '../middleware'
import { Vision } from '../Vision'
import { ElixirEvent } from '../../services/events/Event'
import { ElixirEvents, VisionElixirEnvironment } from '../types'

import * as serveStaticMiddleware from 'koa-static'
import * as compressMiddleware from 'koa-compress'

jest.mock('koa-static', jest.fn(() => jest.fn(() => jest.fn())))
jest.mock('koa-compress', jest.fn(() => jest.fn(() => jest.fn())))

beforeEach(jest.clearAllMocks)

describe('Vision: middleware', () => {
  it ('returns a function from attachVars', () => {
    const middleware = AppMiddleware.attachVars({} as Vision)

    expect(middleware).toBeInstanceOf(Function)
  })

  it ('sets up the context', async () => {
    const middleware = AppMiddleware.setupContext(TEST_VISION_CONFIG)
    const next = jest.fn()
    const ctx = {} as any

    await middleware(ctx, next)

    expect(ctx).toMatchObject({
      vision: {
        config: TEST_VISION_CONFIG,
      },
      elixir: {
        config: ELIXIR_CONFIG
      }
    })

    expect(next).toBeCalledTimes(1)
  })

  it ('sets up the container', async () => {
    const middleware = AppMiddleware.setupContainer()
    const next = jest.fn()
    const ctx = {
      vision: {},
      elixir: {}
    } as any

    await middleware(ctx, next)

    expect(ctx.vision.container).toBeInstanceOf(ElixirContainer)
    expect(ctx.elixir.container).toBeInstanceOf(ElixirContainer)

    expect(next).toBeCalledTimes(1)
  })

  it ('loads the services', async () => {
    const middleware = AppMiddleware.loadServices()

    const Loader = {
      runAllServiceFileExports: jest.fn()
    }

    const ctx = {
      elixir: {
        services: () => Loader,
        config: {
          services: {
            registerFile: 'reg',
            bootFile: 'bo'
          }
        }
      }
    } as any

    const next = jest.fn()

    await middleware(ctx, next)

    expect(Loader.runAllServiceFileExports).toBeCalledTimes(4)
    expect(Loader.runAllServiceFileExports).toBeCalledWith('reg', VisionElixirEnvironment.ELIXIR, [ctx])
    expect(Loader.runAllServiceFileExports).toBeCalledWith('reg', VisionElixirEnvironment.VISION, [ctx])
    expect(Loader.runAllServiceFileExports).toBeCalledWith('bo', VisionElixirEnvironment.ELIXIR, [ctx])
    expect(Loader.runAllServiceFileExports).toBeCalledWith('bo', VisionElixirEnvironment.VISION, [ctx])

    expect(next).toBeCalledTimes(1)
  })

  it ('sets up the loader', async () => {
    const Loader = {} as any

    const Container = {
      singleton: jest.fn()
    }

    const ctx = {
      elixir: {
        services: () => Container,
      }
    } as any

    const next = jest.fn()

    const middleware = AppMiddleware.setupLoader(Loader)

    await middleware(ctx, next)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Loader', Loader)

    expect(next).toBeCalledTimes(1)
  })

  it ('attaches vars', async () => {
    const Emitter = { emit: jest.fn() }
    const Loader = { getConfig: jest.fn(() => ({ name: 'App' })) }

    const ctx = {
      elixir: {
        services: jest.fn(() => ({
          Emitter,
          Loader
        }))
      }
    } as any
    const vision = { isServed: true } as unknown as Vision
    const next = jest.fn()
    const middleware = AppMiddleware.attachVars(vision)

    await middleware(
      ctx as any,
      next
    )

    expect(Emitter.emit).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(ElixirEvents.INIT_VARS, expect.any(ElixirEvent))

    expect(ctx).toHaveProperty('vision')
    expect(ctx.vision).toMatchObject({
      name: 'App',
      instance: vision,
      data: {},
      services: {}
    })
    expect(next).toBeCalledTimes(1)
  })

  it ('returns a function from bodyParser', () => {
    const middleware = AppMiddleware.bodyParser()

    expect(middleware).toBeInstanceOf(Function)
  })

  it ('calls serveStatic', () => {
    const middleware = AppMiddleware.serveStatic('/')

    expect(middleware.name).toBe('serveStatic')
    expect(serveStaticMiddleware).toBeCalledTimes(1)
  })

  it ('calls compress', () => {
    const middleware = AppMiddleware.compress()

    expect(middleware.name).toBe('compress')
    expect(compressMiddleware).toBeCalledTimes(1)
  })

  it ('emits response events', async () => {
    const middleware = AppMiddleware.response()
    const Emitter = { emit: jest.fn() }
    const ctx = {
      vision: {},
      elixir: {
        services: jest.fn(() => Emitter)
      }
    } as any
    const next = jest.fn()

    await middleware(ctx as any, next)

    expect(Emitter.emit).toBeCalledTimes(2)
    expect(next).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(ElixirEvents.RESPONSE_PRE, expect.any(ElixirEvent))
    expect(Emitter.emit).toBeCalledWith(ElixirEvents.RESPONSE_POST, expect.any(ElixirEvent))
  })

  it ('filters content type to text', () => {
    const results = [
      AppMiddleware['filter']('text/html'),
      AppMiddleware['filter']('application/javascript'),
      AppMiddleware['filter']('text/javascript'),
    ]

    const expected = [ true, false, true ]

    expect(results).toEqual(expected)
  })
})
