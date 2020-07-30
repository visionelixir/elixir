import { Vision } from '../../vision/Vision'
import { ElixirConfig } from './Config'

export default class ConfigSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Config', new ElixirConfig())
  }
}
