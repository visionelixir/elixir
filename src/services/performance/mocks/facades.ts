export const PerformanceFacadeMock = () => ({
  PerformanceFacade: {
    start: jest.fn(),
    stop: jest.fn(),
    get: jest.fn(() => ({
      getDuration: jest.fn(() => 12345.12345)
    })),
    all: jest.fn(),
    allArray: jest.fn(() => [
      {
        getName: jest.fn(),
        getDuration: jest.fn()
      },
      {
        getName: jest.fn(),
        getDuration: jest.fn()
      }
    ]),
    clear: jest.fn(),
  },
})
