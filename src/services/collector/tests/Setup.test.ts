import CollectorSetup from '../Setup'
import { ElixirCollector } from '../Collector'

jest.mock('../../../vision/Vision', require('../../../vision/mocks/Vision'))

describe('Collector: Setup', () => {
  it ('should instantiate', async () => {
    const setup = new CollectorSetup()

    expect(setup).toBeInstanceOf(CollectorSetup)
  })

  it ('should run', () => {
    const singletonMock = jest.fn()

    const setup = new CollectorSetup()
    setup.run({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('Collector', expect.any(ElixirCollector))
  })
})
