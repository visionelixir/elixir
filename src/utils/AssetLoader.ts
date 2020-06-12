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

    return this.loadAsset(configPath, true)
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

    this.runServiceAsset(environment, service, file)
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

    this.runServiceAsset(environment, service, file)
  }

  public static runAllServiceSetupFiles(
    environment: VisionElixirEnvironment,
  ): void {
    const services = this.getConfig(environment).services.require
    const vision = VisionFacade

    services.map((service: string) => {
      let SetupClass = null

      try {
        SetupClass = this.loadServiceSetupFile(environment, service)
      } catch (_e) {
        // if no file exists just skip the module
        return false
      }

      if (SetupClass) {
        const setup = new SetupClass()
        setup.run(vision)
      } else {
        throw new Error('No exported setup class found')
      }

      return true
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
    const serviceFile = this.getServiceFilePath(environment, service, file)

    return this.loadAsset(serviceFile, moduleExportedDefault)
  }

  public static runServiceAsset(
    environment: VisionElixirEnvironment,
    service: string,
    file: string,
  ): void {
    const serviceFile = this.getServiceFilePath(environment, service, file)
    this.runAsset(serviceFile)
  }

  protected static getServiceFilePath(
    environment: VisionElixirEnvironment,
    service: string,
    file: string,
  ): string {
    const config = this.getConfig(environment)
    const baseDirectory = config.baseDirectory
    const serviceDirectory = config.services.directory
    const serviceFile = `${baseDirectory}/${serviceDirectory}/${service}/${file}`

    return serviceFile
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static loadAsset(file: string, moduleDefault = false): any {
    const result = this.require(file)

    if (moduleDefault) {
      return result.default
    }

    return result
  }

  public static runAsset(file: string): void {
    this.require(file)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected static require(file: string): any {
    return require(file)
  }
}
