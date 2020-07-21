import { ElixirEvents } from '../../..'
import { EventDispatcherFacade } from '../../events/facades'

jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)

describe('Performance: Events', () => {
  it ('attaches the events', async () => {
    require('../events')

    expect(EventDispatcherFacade.on).toBeCalledTimes(2)
    expect(EventDispatcherFacade.on).toBeCalledWith(ElixirEvents.RESPONSE_PRE, expect.any(Function))
    expect(EventDispatcherFacade.on).toBeCalledWith(ElixirEvents.RESPONSE_POST, expect.any(Function))
  })
})
