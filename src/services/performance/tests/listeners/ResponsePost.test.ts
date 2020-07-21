import { responsePost } from '../../listeners/ResponsePost'
import { ElixirEvent } from '../../../events/Event'
import { ElixirEvents } from '../../../../vision/types'
import { PerformanceFacade } from '../../facades'
import { PerformanceFacadeMock } from '../../mocks/facades'
import { EventDispatcherFacade } from '../../../events/facades'

jest.mock('../../../events/facades', require('../../../events/mocks/facades').EventDispatcherFacadeMock)
jest.mock('../../facades', require('../../mocks/facades').PerformanceFacadeMock)

const ctxMock = {
  set: jest.fn()
}

const eventMock = {
  getData: () => ({
    ctx: ctxMock
  })
} as any

beforeEach(jest.clearAllMocks)

describe('Performance: Listeners: ResponsePost', () => {
  it ('stops the response timer', async () => {
    await responsePost(eventMock)

    expect(PerformanceFacade.stop).toBeCalledTimes(1)
    expect(PerformanceFacade.stop).toBeCalledWith('App:Response')
  })

  it ('sets the response time header', async () => {
    PerformanceFacadeMock().PerformanceFacade.get.mockImplementationOnce(jest.fn(() => ({
      getDuration: jest.fn(() => 12345.12345)
    })))

    await responsePost(eventMock)

    expect(ctxMock.set).toBeCalledTimes(1)
    expect(ctxMock.set).toBeCalledWith('x-elixir-response-time', '12345.12')
  })

  it ('adds the performance data to app data', async () => {
    await responsePost(eventMock)

    expect(EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.APP_DATA, expect.any(ElixirEvent))
  })
})