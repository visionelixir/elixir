import * as elixir from '../../../..'
import { responsePost } from '../../listeners/ResponsePost'
import { ElixirEvent, ElixirEvents } from '../../../..'

// @ts-ignore
elixir['EventDispatcherFacade'] = {
  emit: jest.fn()
} as any

// @ts-ignore
elixir['PerformanceFacade'] = {
  stop: jest.fn(),
  allArray: jest.fn(() => [
    {
      getName: jest.fn(),
      getDuration: jest.fn()
    },
    {
      getName: jest.fn(),
      getDuration: jest.fn()
    }
  ]),
  get: jest.fn(() => ({
    getDuration: jest.fn(() => 12345.12345)
  }))
} as any

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

    expect(elixir.PerformanceFacade.stop).toBeCalledTimes(1)
    expect(elixir.PerformanceFacade.stop).toBeCalledWith('App:Response')
  })

  it ('sets the response time header', async () => {
    await responsePost(eventMock)

    expect(ctxMock.set).toBeCalledTimes(1)
    expect(ctxMock.set).toBeCalledWith('x-elixir-response-time', '12345.12')
  })

  it ('adds the performance data to app data', async () => {
    await responsePost(eventMock)

    expect(elixir.EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(elixir.EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.APP_DATA, expect.any(ElixirEvent))
  })
})