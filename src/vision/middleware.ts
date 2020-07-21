import {
  AsyncVoid,
  Context,
  ElixirEvents,
  Middleware,
  Next,
  VisionElixirEnvironment,
} from './types'
import { ElixirEvent } from '../services/events/Event'
import { EventDispatcherFacade as EventDispatcher } from '../services/events/facades'
import { Vision } from './Vision'
import { AssetLoader } from '../utils/AssetLoader'

import * as serveStaticMiddleware from 'koa-static'
import * as compressMiddleware from 'koa-compress'
import * as path from 'path'
import * as zlib from 'zlib'
import bodyParser = require('koa-bodyparser')

export class AppMiddleware {
  public static attachVars(vision: Vision): Middleware {
    const attachVars = async (ctx: Context, next: Next): AsyncVoid => {
      ctx.vision = {
        name: AssetLoader.getConfig(VisionElixirEnvironment.VISION).name,
        instance: vision,
        data: {},
        services: {},
      }

      await EventDispatcher.emit(
        ElixirEvents.INIT_VARS,
        new ElixirEvent({ vision, data: ctx.vision.data, ctx }),
      )

      await next()
    }

    return attachVars
  }

  public static bodyParser(): Middleware {
    return bodyParser()
  }

  public static serveStatic(root: string): Middleware {
    const serveStatic = serveStaticMiddleware(path.normalize(root), {
      maxAge: 1000 /*ms*/ * 60 /*s*/ * 60 /*m*/ * 24 /*hr*/, // cache for 1-day
    })

    Object.defineProperty(serveStatic, 'name', { value: 'serveStatic' })

    return serveStatic
  }

  public static compress(): Middleware {
    const compress = compressMiddleware({
      filter: this.filter,
      threshold: 0,
      flush: zlib.constants.Z_SYNC_FLUSH,
    })

    Object.defineProperty(compress, 'name', { value: 'compress' })

    return compress
  }

  protected static filter(contentType: string): boolean {
    return /text/i.test(contentType)
  }

  public static response(): Middleware {
    const response = async (ctx: Context, next: Next): AsyncVoid => {
      await EventDispatcher.emit(
        ElixirEvents.RESPONSE_PRE,
        new ElixirEvent({ vision: ctx.vision, ctx }),
      )
      await next()
      await EventDispatcher.emit(
        ElixirEvents.RESPONSE_POST,
        new ElixirEvent({ vision: ctx.vision, ctx }),
      )
    }

    return response
  }
}
