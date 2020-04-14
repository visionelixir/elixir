import { Vision, VisionElixirEnvironment } from '../..'
import { ElixirEventDispatcher } from './exports'
import { AssetLoader } from '../../utils/AssetLoader'

export default class EventsSetup {
  run(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('EventDispatcher', new ElixirEventDispatcher())

    this
      // load glacial service events
      .loadEvents(VisionElixirEnvironment.ELIXIR)

      // load project events
      .loadEvents(VisionElixirEnvironment.VISION)
  }

  protected loadEvents(environment: VisionElixirEnvironment): EventsSetup {
    AssetLoader.loadAllServiceEvents(environment)

    return this
  }
}
