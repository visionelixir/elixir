import { initVarsHandler } from '../events'
import { ElixirEvent } from '../../..'
import { DatabaseManagerFacade as DatabaseManager } from '../facades'
import { EventDispatcherFacade as EventManager } from '../../events/facades'

const ctx = {
  vision: {
    services: {} as any
  }
}

jest.mock('../facades', require('../mocks/facades').DatabaseManagerFacadeMock)
jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)

afterEach(jest.resetAllMocks)

describe('Elixir DatabaseManager Events', () => {
  it ('should handle init vars event', async () => {
    const event = new ElixirEvent({ ctx })

    await initVarsHandler(event)

    expect(DatabaseManager.get).toBeCalledTimes(1)
    expect(EventManager.on).toBeCalledTimes(1)

    expect(ctx.vision.services).toHaveProperty('database')
    expect(ctx.vision.services.database).toHaveProperty('db')
    expect(ctx.vision.services.database).toHaveProperty('dbManager')
  })
})
