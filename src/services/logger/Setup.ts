import { ElixirLogger, Vision } from '../..'

export default class LoggerSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Logger', new ElixirLogger())
  }
}
