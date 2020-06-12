export const LoggerFacadeMock = () => ({
  LoggerFacade: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
})
