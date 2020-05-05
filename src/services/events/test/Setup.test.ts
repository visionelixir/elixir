import * as elixir from '../../../index'
import EventsSetup from '../Setup'
import { VisionElixirEnvironment } from '../../..'

// @ts-ignore
elixir['AssetLoader'] = {
  loadAllServiceEvents: jest.fn()
}

describe('Events: Setup', () => {
  it('can be instantiated', () => {
    const setup = new EventsSetup()

    expect(setup).toBeInstanceOf(EventsSetup)
  })

  it ('can run', () => {
    const setup = new EventsSetup()
    const singletonMock = jest.fn()
    const vision = {
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any

    setup.run(vision)

    // container registration
    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('EventDispatcher', { events: {} })

    // load event files
    expect(elixir['AssetLoader'].loadAllServiceEvents).toBeCalledTimes(2)
    expect(elixir['AssetLoader'].loadAllServiceEvents).toBeCalledWith(VisionElixirEnvironment.ELIXIR)
    expect(elixir['AssetLoader'].loadAllServiceEvents).toBeCalledWith(VisionElixirEnvironment.VISION)
  })
})