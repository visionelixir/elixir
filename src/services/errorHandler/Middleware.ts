import {
  Context,
  Middleware,
  Next,
  AsyncVoid,
  ElixirEvents,
} from '../../vision/types'
import { ElixirEvent } from '../events/Event'
import { LoggerFacade as Logger } from '../logger/facades'
import { EventDispatcherFacade as EventDispatcher } from '../events/facades'
import { PayloadError } from './PayloadError'
import { ElixirError } from './ElixirError'
import { Vision } from '../../vision/Vision'

export class ErrorHandlerMiddleware {
  public static errorHandler(): Middleware {
    const errorHandler = async (ctx: Context, next: Next): AsyncVoid => {
      try {
        await next()
      } catch (error) {
        const { status } = ctx

        if (
          status === undefined ||
          String(status).startsWith('2') ||
          String(status).startsWith('3')
        ) {
          ctx.status = 500
        }

        if (!(error instanceof PayloadError)) {
          error = new ElixirError(error.message, error)
        }

        ctx.error = error

        this.log(error, ctx)
      }

      const { status, vision } = ctx
      await this.emitEvent(vision, status, ctx.error, ctx)
    }

    return errorHandler
  }

  protected static async emitEvent(
    vision: Vision,
    status: number,
    error: PayloadError,
    ctx: Context,
  ): Promise<void> {
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
          error,
          ctx,
        }),
      )
    }
  }

  protected static log(error: PayloadError, ctx: Context): void {
    const { method, url } = ctx
    const { type, name, message, payload } = error

    Logger.error(`[${type}] ${name}: ${message}`)
    Logger.info(`[${method}] ${url}`)

    if (payload) {
      Logger.debug(`Payload:\n${JSON.stringify(error.getPayload(), null, 2)}`)
    }
    Logger.debug(`Stack Trace:\n${error.stack}`)
  }
}
