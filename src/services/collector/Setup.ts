import { Vision } from '../../vision/Vision'
import { ElixirCollector } from './Collector'

export default class CollectorSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Collector', new ElixirCollector())
  }
}
