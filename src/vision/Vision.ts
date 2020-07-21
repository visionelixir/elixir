import * as http from 'http'
import { Server } from 'http'

import {
  Core,
  ElixirEvents,
  VisionConfig,
  VisionElixirEnvironment,
} from './types'
import { Container } from '../services/container/types'
import { ElixirContainer } from '../services/container/Container'
import { ElixirEvent } from '../services/events/Event'
import { AppMiddleware } from './middleware'
import { Middleware } from 'koa'
import { VisionError } from '../services/errorHandler/VisionError'
import { EventDispatcherFacade as EventDispatcher } from '../services/events/facades'
import { LoggerFacade as Logger } from '../services/logger/facades'
import { AssetLoader } from '../utils/AssetLoader'

export class Vision {
  protected core: Core
  protected config: VisionConfig
  protected container: Container
  protected server: Server
  protected isServed: boolean

  /**
   * Constructor
   * Creates a new vision. Passing the optional config runs
   * create on the vision automatically
   */
  constructor(config?: VisionConfig) {
    this.isServed = false
    this.core = new Core()
    this.container = new ElixirContainer()
    this.container.singleton('VisionConfig', config).singleton('Vision', this)

    if (config) {
      this.create(config).then(() => {
        // party!
      })
    }
  }

  /**
   * Errored
   * Called when an error occurs serving the vision
   */
  protected errored(error: Error): Vision {
    Logger.error('Error serving application', error)

    return this
  }

  /**
   * Served
   * Called after the application is successfully served
   */
  protected served(): Vision {
    const { name, host, port } = this.getConfig()

    this.isServed = true

    Logger.info(
      'Welcome to your vision',
      `Running app: ${name}`,
      `http://${host}:${port}`,
    )

    return this
  }

  /**
   * Load Services
   * Loads the elixir services or the vision services
   */
  protected loadServices(environment: VisionElixirEnvironment): Vision {
    AssetLoader.runAllServiceSetupFiles(environment)

    return this
  }

  /**
   * Create
   * Bootstraps the vision so it can be served
   */
  public async create(config: VisionConfig): Promise<Vision> {
    this.config = config

    // load the elixir services
    this.loadServices(VisionElixirEnvironment.ELIXIR)

    await EventDispatcher.emit(
      ElixirEvents.INIT_SERVICE_SETUP_PRE,
      new ElixirEvent({ vision: this, config }),
    )

    // load the vision services
    this.loadServices(VisionElixirEnvironment.VISION)

    await EventDispatcher.emit(
      ElixirEvents.INIT_SERVICE_SETUP_POST,
      new ElixirEvent({ vision: this, config }),
    )

    await this.configureMiddleware()

    return this
  }

  /**
   * Configure Middleware
   */
  protected async configureMiddleware(): Promise<Vision> {
    const middlewareStack = [
      AppMiddleware.response(),
      AppMiddleware.attachVars(this),
      AppMiddleware.compress(),
      AppMiddleware.serveStatic(`${this.getConfig().baseDirectory}/public`),
      AppMiddleware.bodyParser(),
    ]

    await EventDispatcher.emit(
      ElixirEvents.INIT_MIDDLEWARE,
      new ElixirEvent({ vision: this, middlewareStack }),
    )

    middlewareStack.map((middleware: Middleware) => {
      this.getCore().use(middleware)
    })

    return this
  }

  /**
   * Get Container
   * Returns the default containers
   */
  public getContainer(): Container {
    return this.container
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
  public getConfig(): VisionConfig {
    return this.config
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
    return new Promise(resolve => {
      if (!this.config) {
        throw new VisionError('Please run create on your vision before serving')
      }

      const { port } = this.getConfig()

      this.server = http
        .createServer(this.getCore().callback())
        .on('error', error => {
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
