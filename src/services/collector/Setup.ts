import { Vision, ElixirCollector } from '../..'

export default class CollectorSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('Collector', new ElixirCollector())
  }
}
