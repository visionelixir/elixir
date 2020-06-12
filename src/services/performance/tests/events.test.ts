import * as elixir from '../../..'
import { ElixirEvents } from '../../..'

// @ts-ignore
elixir['EventDispatcherFacade'] = {
  on: jest.fn()
} as any

describe('Performance: Events', () => {
  it ('attaches the events', async () => {
    require('../events')

    expect(elixir['EventDispatcherFacade'].on).toBeCalledTimes(2)
    expect(elixir['EventDispatcherFacade'].on).toBeCalledWith(ElixirEvents.RESPONSE_PRE, expect.any(Function))
    expect(elixir['EventDispatcherFacade'].on).toBeCalledWith(ElixirEvents.RESPONSE_POST, expect.any(Function))
  })
})
