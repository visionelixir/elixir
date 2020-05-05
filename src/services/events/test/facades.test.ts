import { EventDispatcherFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Event Dispatcher Facade', () => {
  it ('should return the facade', async () => {
    expect(EventDispatcherFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('EventDispatcher')
  })
})
