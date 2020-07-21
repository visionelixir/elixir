import { ErrorHandlerMiddleware } from '../Middleware'
import { PayloadError } from '../PayloadError'
import { ElixirError } from '../ElixirError'
import { ElixirEvents } from '../../../vision/types'
import { LoggerFacade } from '../../logger/facades'
import { EventDispatcherFacade } from '../../events/facades'

jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)
jest.mock('../../logger/facades', require('../../logger/mocks/facades').LoggerFacadeMock)

afterEach(jest.clearAllMocks)

describe('Error Middleware: Error handler', () => {
  it ('it should do nothing if there are no errors', async () => {
    const next = jest.fn()

    await (ErrorHandlerMiddleware.errorHandler())({} as any, next)

    expect(next).toBeCalledTimes(1)
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
    ErrorHandlerMiddleware['log'](new PayloadError('my error', null), {
      method: 'GET',
      url: 'http://someurl.com',
    } as any)

    expect(LoggerFacade.error).toBeCalledTimes(1)
    expect(LoggerFacade.info).toBeCalledTimes(1)
    expect(LoggerFacade.debug).toBeCalledTimes(1)
  })

  it ('should log the error payload', () => {
    ErrorHandlerMiddleware['log'](new PayloadError('my error', 'payload'), {
      method: 'GET',
      url: 'http://someurl.com',
    } as any)

    expect(LoggerFacade.error).toBeCalledTimes(1)
    expect(LoggerFacade.info).toBeCalledTimes(1)
    expect(LoggerFacade.debug).toBeCalledTimes(2)
  })

  it ('should emit the error event for error codes 4xx & 5xx', async () => {
    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      500,
      new ElixirError('some error', 'some payload'),
      {} as any
    )

    expect(EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(EventDispatcherFacade.emit).toBeCalledWith(
      ElixirEvents.RESPONSE_ERROR,
      {
        "data": {
          "ctx": {},
          "error": new ElixirError('some error'),
          "status": 500,
          "vision": {}
        },
        "name": "event"
      }
    )

    jest.resetAllMocks()

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      404,
      new ElixirError('some error', 'some payload'),
      {} as any
    )

    expect(EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(EventDispatcherFacade.emit).toBeCalledWith(
      ElixirEvents.RESPONSE_ERROR,
      {
        "data": {
          "ctx": {},
          "error": new ElixirError('some error'),
          "status": 404,
          "vision": {}
        },
        "name": "event"
      }
    )
  })

  it ('should not emit the error event for error codes 2xx & 3xx', async () => {
    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      200,
      new ElixirError('some error', 'some payload'),
      {} as any
    )

    expect(EventDispatcherFacade.emit).not.toBeCalled()

    await ErrorHandlerMiddleware['emitEvent'](
      {} as any,
      301,
      new ElixirError('some error', 'some payload'),
      {} as any
    )

    expect(EventDispatcherFacade.emit).not.toBeCalled()
  })
})
