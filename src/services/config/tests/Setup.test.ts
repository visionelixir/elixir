import ConfigSetup from '../Setup'
import { ElixirConfig } from '../Config'

jest.mock('../../../vision/Vision', require('../../../vision/mocks/Vision'))

describe('Config: Setup', () => {
  it ('should instantiate', async () => {
    const setup = new ConfigSetup()

    expect(setup).toBeInstanceOf(ConfigSetup)
  })

  it ('should run', () => {
    const singletonMock = jest.fn()

    const setup = new ConfigSetup()
    setup.run({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('Config', expect.any(ElixirConfig))
  })
})
