export const LoggerMockObject = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
  notice: jest.fn(),
  critical: jest.fn(),
  alert: jest.fn(),
  emergency: jest.fn(),
}

export const LoggerMock = () => ({
  ElixirLogger: jest.fn(() => LoggerMockObject),
})
