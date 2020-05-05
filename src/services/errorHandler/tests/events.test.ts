import * as elixir from '../../..'
import { ElixirEvent } from '../../..'

let passedCallback: any = null

jest.mock('../Middleware', () => ({
  ErrorHandlerMiddleware: {
    errorHandler: () => 'error middleware'
  }
}))

// @ts-ignore
elixir['EventDispatcherFacade'] = {
  on: jest.fn((_event, callback) => {
    passedCallback = callback
  })
} as any

afterEach(jest.clearAllMocks)

describe('Error Middleware: Error handler', () => {
  it('should listen to the event', async () => {
    require('../events')

    expect(elixir['EventDispatcherFacade'].on).toBeCalledTimes(1)
  })

  it ('should add the middleware', async () => {
    require('../events')

    expect(passedCallback).not.toBeNull()

    const data = {
      middlewareStack: [ () => {}, () => {} ]
    }

    await passedCallback(new ElixirEvent(data))

    expect(data.middlewareStack).toHaveLength(3)
    expect(data.middlewareStack[0]).toEqual('error middleware')
  })
})