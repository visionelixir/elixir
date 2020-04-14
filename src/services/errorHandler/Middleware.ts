import {
  Context,
  Middleware,
  Next,
  AsyncVoid,
  ElixirEvent,
  ElixirEvents,
  LoggerFacade as Logger,
  EventDispatcherFacade as EventDispatcher,
} from '../..'

export class ErrorHandlerMiddleware {
  public static errorHandler(): Middleware {
    const errorHandler = async (ctx: Context, next: Next): AsyncVoid => {
      try {
        await next()
      } catch (error) {
        const { method, url } = ctx
        const { type, name, message, payload } = error

        Logger.error(`[${type}] ${name}: ${message}`)
        Logger.info(`[${method}] ${url}`)
        if (payload) {
          Logger.debug(
            `Payload:\n${JSON.stringify(error.getPayload(), null, 2)}`,
          )
        }
        Logger.debug(`Stack Trace:\n${error.stack}`)

        ctx.status = 500
        ctx.error = error
      }

      const { status, vision } = ctx

      if (
        status !== undefined &&
        !String(status).startsWith('2') &&
        !String(status).startsWith('3')
      ) {
        await EventDispatcher.emit(
          ElixirEvents.RESPONSE_ERROR,
          new ElixirEvent({
            vision,
            status,
            error: ctx.error,
            ctx,
          }),
        )
      }
    }

    return errorHandler
  }
}
