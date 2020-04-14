export const EventDispatcherFacadeMock = () => ({
  EventDispatcherFacade: {
    on: jest.fn(),
    emit: jest.fn(),
  },
})
