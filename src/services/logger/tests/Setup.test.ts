import LoggerSetup from '../Setup'
import { ElixirLogger } from '../Logger'

describe('Logger: Setup', () => {
  it ('should instantiate', async () => {
    const setup = new LoggerSetup()

    expect(setup).toBeInstanceOf(LoggerSetup)
  })

  it ('should run', () => {
    const singletonMock = jest.fn()

    const setup = new LoggerSetup()
    setup.run({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('Logger', expect.any(ElixirLogger))
  })
})
