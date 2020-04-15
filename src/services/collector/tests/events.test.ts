import { appDataHandler, responsePostHandler, responsePreHandler } from '../events'
import { CollectorFacade } from '../facades'
import { EventDispatcherFacade } from '../../events/facades'
import { LoggerFacade } from '../../logger/facades'
import { ElixirEvent, ElixirEvents } from '../../..'

const ctx = {
  request: { method: 'GET', url: '/' },
  response: { status: 200 }
}

jest.mock('../facades', require('../mocks/facades').CollectorFacadeMock)
jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)
jest.mock('../../logger/facades', require('../../logger/mocks/facades').LoggerFacadeMock)

afterEach(jest.resetAllMocks)

describe('Elixir Collector Events', () => {
  it ('should handle app data event', async () => {
    const collection = 'collection'
    const payload = 'payload'
    const event = { getData: () => ({ collection, payload }) } as any

    await appDataHandler(event)

    expect(CollectorFacade.add).toBeCalledTimes(1)
    expect(CollectorFacade.add).toBeCalledWith(collection, payload)
  })

  it ('should handle response pre event', async () => {
    await responsePreHandler()

    expect(CollectorFacade.clear).toBeCalledTimes(1)
  })

  it ('should handle response post event', async () => {
    const event = { getData: () => ({ ctx }) } as any

    await responsePostHandler(event)

    expect(EventDispatcherFacade.emit).toBeCalledTimes(1)
    expect(EventDispatcherFacade.emit).toBeCalledWith(ElixirEvents.APP_DATA, expect.any(ElixirEvent))
    expect(LoggerFacade.info).toBeCalledTimes(1)
    expect(LoggerFacade.debug).toBeCalledTimes(1)
    expect(CollectorFacade.all).toBeCalledTimes(1)
  })
})
