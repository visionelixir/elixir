import {
  Context,
  Middleware,
  Next,
  AsyncVoid,
  ElixirEvents,
} from '../../vision/types'
import { ElixirEvent } from '../events/Event'
import { Emitter as IEmitter } from '../events/types'
import { Logger as ILogger } from '../logger/types'
import { PayloadError } from './PayloadError'
import { ElixirError } from './ElixirError'
import { Vision } from '../../vision/Vision'

export class ErrorHandlerMiddleware {
  public static errorHandler(): Middleware {
    const errorHandler = async (ctx: Context, next: Next): AsyncVoid => {
      try {
        ctx.error = null
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
          const err = new ElixirError(error.message, error)
          err.stack = error.stack
          error = err
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
    error: PayloadError | null,
    ctx: Context,
  ): Promise<void> {
    const Emitter: IEmitter = ctx.elixir.services('Emitter')

    if (
      status !== undefined &&
      !String(status).startsWith('2') &&
      !String(status).startsWith('3')
    ) {
      await Emitter.emit(
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
    const Logger: ILogger = ctx.elixir.services('Logger')

    Logger.critical('App', message, {
      type,
      name,
      message,
      payload,
      stack: error.stack,
      method,
      url,
    })
  }
}
