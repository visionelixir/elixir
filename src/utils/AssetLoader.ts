import {
  ContainerManager,
  ElixirConfig,
  VisionConfig,
  VisionElixirEnvironment,
} from '..'
import { ELIXIR_CONFIG } from '../vision/config'
import * as path from 'path'
import { VisionFacade } from '../vision/facades'

export class AssetLoader {
  public static getVisionConfig(): VisionConfig {
    return ContainerManager.get().resolve('VisionConfig')
  }

  public static getElixirConfig(): ElixirConfig {
    return ELIXIR_CONFIG
  }

  public static getConfig(
    environment: VisionElixirEnvironment.VISION,
  ): VisionConfig
  public static getConfig(
    environment: VisionElixirEnvironment.ELIXIR,
  ): ElixirConfig
  public static getConfig(
    environment: VisionElixirEnvironment,
  ): VisionConfig | ElixirConfig
  public static getConfig(
    environment: VisionElixirEnvironment,
  ): VisionConfig | ElixirConfig {
    if (environment === VisionElixirEnvironment.ELIXIR) {
      return this.getElixirConfig()
    } else {
      return this.getVisionConfig()
    }
  }

  public static loadConfig<T>(
    environment: VisionElixirEnvironment,
    name: string,
  ): T {
    const { baseDirectory, configDirectory } = this.getConfig(environment)
    const configPath = path.normalize(
      `${baseDirectory}/${configDirectory}/${name}`,
    )

    return this.loadAsset(configPath).default
  }

  public static loadAllServiceEvents(
    environment: VisionElixirEnvironment,
  ): void {
    const services = this.getConfig(environment).services.require

    services.map((service: string) => {
      this.loadServiceEvents(environment, service)
    })
  }

  public static loadServiceEvents(
    environment: VisionElixirEnvironment,
    service: string,
  ): void {
    const config = this.getConfig(environment)
    const file = config.services.eventFile

    this.requireServiceAsset(environment, service, file)
  }

  public static loadAllServiceRoutes(
    environment: VisionElixirEnvironment,
  ): void {
    const services = this.getConfig(environment).services.require

    services.map((service: string) => {
      this.loadServiceRoutes(environment, service)
    })
  }

  public static loadServiceRoutes(
    environment: VisionElixirEnvironment,
    service: string,
  ): void {
    const config = this.getConfig(environment)
    const file = config.services.routeFile

    this.requireServiceAsset(environment, service, file)
  }

  public static runAllServiceSetupFiles(
    environment: VisionElixirEnvironment,
  ): void {
    const services = this.getConfig(environment).services.require
    const vision = VisionFacade

    services.map((service: string) => {
      const SetupClass = this.loadServiceSetupFile(environment, service)

      if (SetupClass) {
        const setup = new SetupClass()
        setup.run(vision)
      }
    })
  }

  public static loadServiceSetupFile(
    environment: VisionElixirEnvironment,
    service: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const config = this.getConfig(environment)
    const file = config.services.setupFile

    return this.loadServiceAsset(environment, service, file, true)
  }

  public static loadServiceAsset(
    environment: VisionElixirEnvironment,
    service: string,
    file: string,
    moduleExportedDefault = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const config = this.getConfig(environment)
    const baseDirectory = config.baseDirectory
    const serviceDirectory = config.services.directory
    const serviceFile = `${baseDirectory}/${serviceDirectory}/${service}/${file}`

    try {
      return this.loadAsset(serviceFile, moduleExportedDefault)
    } catch (error) {
      // do nothing as it's ok if a service doesn't have a setup file
      return null
    }
  }

  public static requireServiceAsset(
    environment: VisionElixirEnvironment,
    service: string,
    file: string,
  ): void {
    const config = this.getConfig(environment)
    const baseDirectory = config.baseDirectory
    const serviceDirectory = config.services.directory
    const serviceFile = `${baseDirectory}/${serviceDirectory}/${service}/${file}`

    try {
      this.requireAsset(serviceFile)
    } catch (error) {
      // do nothing as it's ok if a service doesn't have a setup file
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static loadAsset(file: string, moduleDefault = false): any {
    if (moduleDefault) {
      return require(file).default
    }

    return require(file)
  }

  public static requireAsset(file: string): void {
    require(file)
  }
}
