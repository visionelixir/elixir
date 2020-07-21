import { EventDispatcherFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('Event Dispatcher Facade', () => {
  it ('should return the facade', async () => {
    expect(EventDispatcherFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('EventDispatcher')
  })
})
