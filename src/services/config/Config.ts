import { KeyValue, VisionElixirEnvironment } from '../../vision/types'
import { ElixirLoader } from '../../utils/Loader'
import { Config } from './types'

export class ElixirConfig implements Config {
  protected loader: ElixirLoader

  public constructor(Loader: ElixirLoader) {
    this.loader = Loader
  }

  public get = (name: string, service?: string): KeyValue => {
    let config = {}

    if (service) {
      const serviceConfig: KeyValue = this.loader.loadServiceAsset(
        VisionElixirEnvironment.VISION,
        service,
        `config/${name}`,
      )
      config = { ...config, ...serviceConfig }
    }
    const visionConfig: KeyValue = this.loader.loadConfig(
      VisionElixirEnvironment.VISION,
      name,
    )

    config = { ...config, ...visionConfig }

    return config
  }
}
