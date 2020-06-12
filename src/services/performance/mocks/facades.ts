export const PerformanceFacadeMock = () => ({
  PerformanceFacade: {
    start: jest.fn(),
    stop: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    allArray: jest.fn(),
    clear: jest.fn(),
  },
})
