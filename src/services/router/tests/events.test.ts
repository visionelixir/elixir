import { ElixirEvents } from '../../../vision/types'
import { EventDispatcherFacade } from '../../events/facades'

jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)

describe('Router: Events', () => {
  it ('attaches the events', async () => {
    require('../events')

    expect(EventDispatcherFacade.on).toBeCalledTimes(1)
    expect(EventDispatcherFacade.on).toBeCalledWith(ElixirEvents.INIT_MIDDLEWARE, expect.any(Function))
  })
})
