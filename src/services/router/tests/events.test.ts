import * as elixir from '../../..'
import { ElixirEvents } from '../../..'

// @ts-ignore
elixir['EventDispatcherFacade'] = {
  on: jest.fn()
} as any

describe('Router: Events', () => {
  it ('attaches the events', async () => {
    require('../events')

    expect(elixir['EventDispatcherFacade'].on).toBeCalledTimes(1)
    expect(elixir['EventDispatcherFacade'].on).toBeCalledWith(ElixirEvents.INIT_MIDDLEWARE, expect.any(Function))
  })
})
