import { ElixirEvent } from '../../events/Event'
import { EventDispatcherFacade } from '../../events/facades'

jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)

let passedCallback: any = null

jest.mock('../Middleware', () => ({
  ErrorHandlerMiddleware: {
    errorHandler: () => 'error middleware'
  }
}))

afterEach(jest.clearAllMocks)

describe('Error Middleware: Error handler', () => {
  it ('should add the middleware and should listen to the event', async () => {
    // @ts-ignore
    EventDispatcherFacade.on.mockImplementationOnce((_event, callback) => {
      passedCallback = callback
    })

    require('../events')

    expect(passedCallback).not.toBeNull()

    const data = {
      middlewareStack: [ () => {}, () => {} ]
    }

    await passedCallback(new ElixirEvent(data))

    expect(data.middlewareStack).toHaveLength(3)
    expect(data.middlewareStack[0]).toEqual('error middleware')
    expect(EventDispatcherFacade.on).toBeCalledTimes(1)
  })
})
