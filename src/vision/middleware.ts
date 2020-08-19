import * as compressMiddleware from 'koa-compress'
import * as serveStaticMiddleware from 'koa-static'
import * as path from 'path'
import { ElixirContainer } from '../services/container/Container'
import { Container as IContainer } from '../services/container/types'
import { ElixirEvent } from '../services/events/Event'
import { Emitter as IEmitter } from '../services/events/types'
import { ElixirLoader } from '../utils/Loader'
import { ELIXIR_CONFIG } from './config'
import {
  ElixirEvents,
  Middleware,
  VisionConfig,
  VisionElixirEnvironment,
} from './types'
import { Vision } from './Vision'
import bodyParser = require('koa-bodyparser')

export class AppMiddleware {
  public static setupContext(config: VisionConfig): Middleware {
    const setupContext: Middleware = async (ctx, next) => {
      ctx.vision = {
        config: config,
      }
      ctx.elixir = {
        config: ELIXIR_CONFIG,
      }

      await next()
    }

    return setupContext
  }

  public static attachVars(vision: Vision): Middleware {
    const attachVars: Middleware = async (ctx, next) => {
      const {
        Emitter,
        Loader,
      }: { Emitter: IEmitter; Loader: ElixirLoader } = ctx.elixir.services(
        'Emitter',
        'Loader',
      )

      ctx.vision = {
        name: Loader.getConfig(VisionElixirEnvironment.VISION).name,
        instance: vision,
        data: {},
        services: {},
      }

      Emitter.emit(
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
    })

    Object.defineProperty(compress, 'name', { value: 'compress' })

    return compress
  }

  protected static filter(contentType: string): boolean {
    return /text/i.test(contentType)
  }

  public static response(): Middleware {
    const response: Middleware = async (ctx, next) => {
      const Emitter: IEmitter = ctx.elixir.services('Emitter')

      Emitter.emit(
        ElixirEvents.RESPONSE_PRE,
        new ElixirEvent({ vision: ctx.vision, ctx }),
      )

      await next()

      Emitter.emit(
        ElixirEvents.RESPONSE_POST,
        new ElixirEvent({ vision: ctx.vision, ctx }),
      )
    }

    return response
  }

  public static setupContainer(): Middleware {
    const setupContainer: Middleware = async (ctx, next) => {
      const container = new ElixirContainer()

      ctx.vision.container = container
      ctx.vision.services = container.resolve.bind(container)

      ctx.elixir.container = container
      ctx.elixir.services = container.resolve.bind(container)

      await next()
    }

    return setupContainer
  }

  public static loadServices(): Middleware {
    const loadServices: Middleware = async (ctx, next) => {
      const Loader: ElixirLoader = ctx.elixir.services('Loader')
      const { registerFile, bootFile } = ctx.elixir.config.services

      // register elixir services
      Loader.runAllServiceFileExports(
        registerFile,
        VisionElixirEnvironment.ELIXIR,
        [ctx],
      )

      // register vision services
      Loader.runAllServiceFileExports(
        registerFile,
        VisionElixirEnvironment.VISION,
        [ctx],
      )

      // boot elixir services
      Loader.runAllServiceFileExports(
        bootFile,
        VisionElixirEnvironment.ELIXIR,
        [ctx],
      )

      // boot vision services
      Loader.runAllServiceFileExports(
        bootFile,
        VisionElixirEnvironment.VISION,
        [ctx],
      )

      await next()
    }

    return loadServices
  }

  public static setupLoader(loader: ElixirLoader): Middleware {
    const setupLoader: Middleware = async (ctx, next) => {
      const Container: IContainer = ctx.elixir.services('Container')

      Container.singleton('Loader', loader)

      await next()
    }

    return setupLoader
  }
}
