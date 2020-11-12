import { LoggerMockObject } from '../../logger/mocks/Logger'
import { ErrorHandlerMiddleware } from '../Middleware'
import { PayloadError } from '../PayloadError'
import { ElixirError } from '../ElixirError'
import { ElixirEvents } from '../../../vision/types'

/**
 * Mock the services
 */

const Emitter = {
  emit: jest.fn(),
}

const Logger = LoggerMockObject

const elixir = {
  services: jest.fn((...args) => {
    if (args[0] === 'Emitter') {
      return Emitter
    }

    if (args[0] === 'Logger') {
      return Logger
    }

    return { Emitter, Logger }
  })
}

afterEach(jest.clearAllMocks)

/**
 * Tests
 */

describe('Error Middleware: Error handler', () => {
  it ('it should do nothing if there are no errors', async () => {
    const next = jest.fn()

    const ctx = {
      elixir
    }

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(next).toBeCalledTimes(1)
  })

  it ('it should set the status to 500 if it is 200', async () => {
    const next = jest.fn(async () => { throw new Error() })

    let ctx = {
      status: undefined,
      vision: {},
      elixir
    } as any

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(ctx.status).toEqual(500)

    ctx = {
      status: 200,
      vision: {},
      elixir
    } as any

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(ctx.status).toEqual(500)

    ctx = {
      status: 300,
      vision: {},
      elixir
    } as any

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(ctx.status).toEqual(500)

    expect(next).toBeCalledTimes(3)
  })

  it ('should catch all errors and add them to the ctx', async () => {
    const next = jest.fn().mockImplementationOnce(() => {
      throw new PayloadError('oh no something went wrong')
    })

    const ctx = {
      status: 404,
      vision: {},
    } as any

    const logOriginal = ErrorHandlerMiddleware['log']
    const emitEventOriginal = ErrorHandlerMiddleware['emitEvent']

    ErrorHandlerMiddleware['log'] = jest.fn()
    ErrorHandlerMiddleware['emitEvent'] = jest.fn()

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(ErrorHandlerMiddleware['log']).toBeCalledTimes(1)
    expect(ErrorHandlerMiddleware['emitEvent']).toBeCalledTimes(1)
    expect(ctx).toHaveProperty('error')
    expect(ctx.error).toBeInstanceOf(PayloadError)

    ErrorHandlerMiddleware['log'] = logOriginal
    ErrorHandlerMiddleware['emitEvent'] = emitEventOriginal
  })

  it ('should convert errors to elixir errors', async () => {
    const next = jest.fn().mockImplementationOnce(() => {
      throw new Error('oh no something went wrong')
    })

    const ctx = {
      status: 404,
      vision: {},
    } as any

    const logOriginal = ErrorHandlerMiddleware['log']
    const emitEventOriginal = ErrorHandlerMiddleware['emitEvent']

    ErrorHandlerMiddleware['log'] = jest.fn()
    ErrorHandlerMiddleware['emitEvent'] = jest.fn()

    await (ErrorHandlerMiddleware.errorHandler())(ctx as any, next)

    expect(ErrorHandlerMiddleware['log']).toBeCalledTimes(1)
    expect(ErrorHandlerMiddleware['emitEvent']).toBeCalledTimes(1)
    expect(ctx).toHaveProperty('error')
    expect(ctx.error).toBeInstanceOf(PayloadError)

    ErrorHandlerMiddleware['log'] = logOriginal
    ErrorHandlerMiddleware['emitEvent'] = emitEventOriginal
  })

  it ('should log the error', () => {
    const ctx = {
      elixir,
      method: 'GET',
      url: 'http://someurl.com',
    }

    ErrorHandlerMiddleware['log'](new PayloadError('my error', null), ctx as any)

    expect(Logger.critical).toBeCalledTimes(1)
  })

  it ('should log the error payload', () => {
    const ctx = {
      elixir,
      method: 'GET',
      url: 'http://someurl.com',
    }

    ErrorHandlerMiddleware['log'](new PayloadError('my error', 'payload'), ctx as any)

    expect(Logger.critical).toBeCalledTimes(1)
  })

  it ('should emit the error event for error codes 4xx & 5xx', async () => {
    const ctx = {
      elixir
    }

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      500,
      new ElixirError('some error', 'some payload'),
      ctx as any
    )

    expect(Emitter.emit).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(
      ElixirEvents.RESPONSE_ERROR,
      {
        data: {
          ctx,
          error: new ElixirError('some error'),
          status: 500,
          vision: {}
        },
        name: 'event'
      }
    )

    jest.clearAllMocks()

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      404,
      null,
      ctx as any
    )

    expect(Emitter.emit).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(
      ElixirEvents.RESPONSE_ERROR,
      {
        data: {
          ctx,
          error: null,
          status: 404,
          vision: {}
        },
        name: 'event'
      }
    )
  })

  it ('should not emit the error event for error codes 2xx & 3xx', async () => {
    const ctx = {
      elixir,
    }

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      200,
      new ElixirError('some error', 'some payload'),
      ctx as any
    )

    expect(Emitter.emit).not.toBeCalled()

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      301,
      new ElixirError('some error', 'some payload'),
      ctx as any
    )

    expect(Emitter.emit).not.toBeCalled()
  })
})
