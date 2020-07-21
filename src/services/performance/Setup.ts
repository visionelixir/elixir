import { ElixirPerformance } from './Performance'
import { Vision } from '../../vision/Vision'

export default class PerformanceSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Performance', new ElixirPerformance())
  }
}
