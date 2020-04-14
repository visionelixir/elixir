import { ElixirPerformance, Vision } from '../..'

export default class PerformanceSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Performance', new ElixirPerformance())
  }
}
