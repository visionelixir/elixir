import PerformanceSetup from '../Setup'

const singletonMock = jest.fn()

const visionMock = {
  getContainer: () => ({
    singleton: singletonMock
  })
} as any

describe('Performance: Setup', () => {
  it ('registers the facade in the container', () => {
    const setup = new PerformanceSetup()

    setup.run(visionMock)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('Performance', expect.anything())
  })
})