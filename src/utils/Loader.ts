import {
  ElixirConf,
  VisionConfig,
  VisionElixirEnvironment,
} from '../vision/types'
import { ELIXIR_CONFIG } from '../vision/config'
import * as path from 'path'

export class ElixirLoader {
  public visionConfig: VisionConfig

  public constructor(visionConfig: VisionConfig) {
    this.visionConfig = visionConfig
  }

  public getVisionConfig(): VisionConfig {
    return this.visionConfig
  }

  public getElixirConfig(): ElixirConf {
    return ELIXIR_CONFIG
  }

  public getConfig(environment: VisionElixirEnvironment.VISION): VisionConfig
  public getConfig(environment: VisionElixirEnvironment.ELIXIR): ElixirConf
  public getConfig(
    environment: VisionElixirEnvironment,
  ): VisionConfig | ElixirConf
  public getConfig(
    environment: VisionElixirEnvironment,
  ): VisionConfig | ElixirConf {
    if (environment === VisionElixirEnvironment.ELIXIR) {
      return this.getElixirConfig()
    }

    return this.getVisionConfig()
  }

  public loadConfig<T>(environment: VisionElixirEnvironment, name: string): T {
    const { baseDirectory, configDirectory } = this.getConfig(environment)
    const configPath = path.normalize(
      `${baseDirectory}/${configDirectory}/${name}`,
    )

    const config = this.loadAsset(configPath)

    return config.default
  }

  public runAllServiceFileExports(
    file: string,
    environment: VisionElixirEnvironment,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any[] = [],
    exportName = 'default',
  ): void {
    const services = this.getConfig(environment).services.require

    services.map((service: string) => {
      let module = null

      try {
        module = this.loadServiceAsset(environment, service, file)
      } catch (_e) {
        // if no file exists just skip the module
        return false
      }

      if (module[exportName]) {
        module[exportName](...params)
      }

      return true
    })
  }

  public loadServiceAsset(
    environment: VisionElixirEnvironment,
    service: string,
    file: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const serviceFile = this.getServiceFilePath(environment, service, file)

    return this.loadAsset(serviceFile)
  }

  protected getServiceFilePath(
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
  public loadAsset(file: string): any {
    const result = this.require(file)

    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected require(file: string): any {
    return require(file)
  }
}
