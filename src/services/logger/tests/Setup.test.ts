import LoggerSetup from '../Setup'

jest.mock('../../..', () => ({
  Vision: {} as any,
  ElixirLogger: class {} as any
}))

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
    expect(singletonMock).toBeCalledWith('Logger', {})
  })
})
