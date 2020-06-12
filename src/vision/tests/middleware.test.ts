import { AppMiddleware } from '../middleware'
import { Vision } from '../Vision'
import * as elixir from '../..'
import { ElixirEvent, ElixirEvents } from '../..'

import * as serveStaticMiddleware from 'koa-static'
import * as compressMiddleware from 'koa-compress'

jest.mock('koa-static', jest.fn(() => jest.fn(() => jest.fn())))
jest.mock('koa-compress', jest.fn(() => jest.fn(() => jest.fn())))

// @ts-ignore
elixir['AssetLoader'] = {
  getConfig: jest.fn(() => ({
    name: 'myApp'
  }))
}

// @ts-ignore
elixir['EventDispatcherFacade'] = {
  emit: jest.fn()
}

beforeEach(jest.clearAllMocks)

describe('Vision: middleware', () => {
  it ('returns a function from attachVars', () => {
    const middleware = AppMiddleware.attachVars({} as Vision)

    expect(middleware).toBeInstanceOf(Function)
  })

  it ('attaches vars', async () => {
    const ctx = {} as any
    const vision = { isServed: true } as unknown as Vision
    const next = jest.fn()
    const middleware = AppMiddleware.attachVars(vision)

    await middleware(
      ctx as any,
      next
    )

    expect(elixir.EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(elixir.EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.INIT_VARS, expect.any(ElixirEvent))

    expect(ctx).toHaveProperty('vision')
    expect(ctx.vision).toMatchObject({
      name: 'myApp',
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

    const next = jest.fn()

    await middleware({
      vision: {}
    } as any, next)

    expect(elixir.EventDispatcherFacade.emit).toBeCalledTimes(2)
    expect(next).toBeCalledTimes(1)
    expect(elixir.EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.RESPONSE_PRE, expect.any(ElixirEvent))
    expect(elixir.EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.RESPONSE_POST, expect.any(ElixirEvent))
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
