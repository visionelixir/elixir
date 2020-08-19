import { VisionElixirEnvironment } from '../../../vision/types'
import boot from '../boot'

const Loader = {
  runAllServiceFileExports: jest.fn()
}

const ctx = {
  elixir: {
    services: () => Loader,
    config: {
      services: {
        eventFile: 'elixirEvents',
      }
    }
  },
  vision: {
    config: {
      services: {
        eventFile: 'visionEvents'
      }
    }
  }
} as any

describe('Events: Boot', () => {
  it('loads all the event files', () => {
    boot(ctx)

    expect(Loader.runAllServiceFileExports).toBeCalledTimes(2)
    expect(Loader.runAllServiceFileExports).toBeCalledWith('elixirEvents', VisionElixirEnvironment.ELIXIR, [ctx])
    expect(Loader.runAllServiceFileExports).toBeCalledWith('visionEvents', VisionElixirEnvironment.VISION, [ctx])
  })
})