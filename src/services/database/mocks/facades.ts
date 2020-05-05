export const DatabaseManagerFacadeMock = () => ({
  DatabaseManagerFacade: {
    add: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
  },
})
