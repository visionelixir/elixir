import { ElixirLogger } from './Logger'
import { Vision } from '../../vision/Vision'

export default class LoggerSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Logger', new ElixirLogger())
  }
}
