import * as http from 'http'
import { Server } from 'http'
import { Middleware } from 'koa'
import { VisionError } from '../services/errorHandler/VisionError'
import { ElixirEmitter } from '../services/events/Emitter'
import { ElixirEvent } from '../services/events/Event'
import { Emitter } from '../services/events/types'
import { ElixirLogger } from '../services/logger/Logger'
import { Logger } from '../services/logger/types'
import { ElixirLoader } from '../utils/Loader'
import { ELIXIR_CONFIG } from './config'
import { AppMiddleware } from './middleware'
import {
  Core,
  ElixirConf,
  ElixirGlobalEvents,
  VisionConfig,
  VisionElixirEnvironment,
} from './types'

export class Vision {
  protected core: Core
  protected visionConfig: VisionConfig
  protected elixirConfig: ElixirConf = ELIXIR_CONFIG
  protected loader: ElixirLoader
  protected server: Server
  protected isServed: boolean
  protected logger: Logger
  protected emitter: Emitter

  /**
   * Constructor
   * Creates a new vision. Passing the optional config runs
   * create on the vision automatically
   */
  constructor(config?: VisionConfig) {
    this.isServed = false
    this.core = new Core()
    this.logger = new ElixirLogger()
    this.emitter = new ElixirEmitter()

    if (config) {
      this.create(config)
    }
  }

  /**
   * Errored
   * Called when an error occurs serving the vision
   */
  protected errored(error: Error): Vision {
    this.logger.error('Error serving application', error)

    return this
  }

  /**
   * Served
   * Called after the application is successfully served
   */
  protected served(): Vision {
    const { name, host, port } = this.getConfig()

    this.isServed = true

    this.logger.info(
      'Welcome to your vision',
      `Running app: ${name}`,
      `http://${host}:${port}`,
    )

    return this
  }

  /**
   * Create
   * Bootstraps the vision so it can be served
   */
  public create(config: VisionConfig): Vision {
    this.visionConfig = config
    this.loader = new ElixirLoader(config)

    this.loadAppBoot().loadAppEvents().configureMiddleware()

    return this
  }

  /**
   * Load App Boot
   */
  protected loadAppBoot(): Vision {
    this.loader.runAllServiceFileExports(
      ELIXIR_CONFIG.services.bootFile,
      VisionElixirEnvironment.ELIXIR,
      [this],
      'global',
    )

    this.loader.runAllServiceFileExports(
      this.visionConfig.services.bootFile,
      VisionElixirEnvironment.VISION,
      [this],
      'global',
    )

    return this
  }

  /**
   * Load App Events
   *
   * Loads any existing app level events
   */
  protected loadAppEvents(): Vision {
    this.loader.runAllServiceFileExports(
      ELIXIR_CONFIG.services.eventFile,
      VisionElixirEnvironment.ELIXIR,
      [this],
      'global',
    )

    this.loader.runAllServiceFileExports(
      this.visionConfig.services.eventFile,
      VisionElixirEnvironment.VISION,
      [this],
      'global',
    )

    return this
  }

  /**
   * Configure Middleware
   */
  protected configureMiddleware(): Vision {
    const middlewareStack = [
      AppMiddleware.setupContext(this.visionConfig),
      AppMiddleware.setupContainer(),
      AppMiddleware.setupLoader(this.loader),
      AppMiddleware.loadServices(),
      AppMiddleware.response(),
      AppMiddleware.compress(),
      AppMiddleware.serveStatic(`${this.getConfig().baseDirectory}/public`),
      AppMiddleware.attachVars(this),
      AppMiddleware.bodyParser(),
    ]

    this.emitter.emit(
      ElixirGlobalEvents.INIT_MIDDLEWARE,
      new ElixirEvent({ vision: this, middlewareStack }),
    )

    middlewareStack.map((middleware: Middleware) => {
      this.getCore().use(middleware)
    })

    return this
  }

  /**
   * Get Core
   * Returns the core instance (koa)
   */
  public getCore(): Core {
    return this.core
  }

  /**
   * Get Config
   * Returns the vision config
   */
  public getConfig(environment: VisionElixirEnvironment.VISION): VisionConfig
  public getConfig(environment: VisionElixirEnvironment.ELIXIR): ElixirConf
  public getConfig(): VisionConfig
  public getConfig(
    environment: VisionElixirEnvironment = VisionElixirEnvironment.VISION,
  ): VisionConfig | ElixirConf {
    if (environment === VisionElixirEnvironment.ELIXIR) {
      return this.elixirConfig
    }

    return this.visionConfig
  }

  /**
   * Get Emitter
   * Returns the app emitter
   */
  public getEmitter(): Emitter {
    return this.emitter
  }

  /**
   * Get Loader
   * Returns the loader
   */
  public getLoader(): ElixirLoader {
    return this.loader
  }

  /**
   * Get Status
   * Returns if the vision is currently being served or not
   */
  public getStatus(): boolean {
    return this.isServed
  }

  /**
   * Serves the vision
   */
  public async up(): Promise<Vision | false> {
    return new Promise((resolve) => {
      if (!this.visionConfig) {
        throw new VisionError('Please run create on your vision before serving')
      }

      const { port } = this.getConfig()

      this.server = http
        .createServer(this.getCore().callback())
        .on('error', (error) => {
          this.errored(error)
          resolve(false)
        })
        .listen(port, () => {
          this.served()
          resolve(this)
        })
    })
  }

  /**
   * Down
   * Tears down the served vision
   */
  public down = async (): Promise<Vision> => {
    return new Promise((resolve, reject) => {
      this.server.close((error: Error) => {
        if (error) {
          reject(error)
        }

        this.isServed = false

        resolve(this)
      })
    })
  }
}
