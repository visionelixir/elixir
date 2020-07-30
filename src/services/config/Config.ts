import { AssetLoader } from '../../utils/AssetLoader'
import { KeyValue, VisionElixirEnvironment } from '../../vision/types'
import { Config } from './types'

export class ElixirConfig implements Config {
  public get = (name: string, service?: string): KeyValue => {
    let config = {}

    if (service) {
      const serviceConfig: KeyValue = AssetLoader.loadServiceAsset(
        VisionElixirEnvironment.VISION,
        service,
        `config/${name}`,
        true,
      )
      config = { ...config, ...serviceConfig }
    }
    const visionConfig: KeyValue = AssetLoader.loadConfig(
      VisionElixirEnvironment.VISION,
      name,
    )

    config = { ...config, ...visionConfig }

    return config
  }
}
