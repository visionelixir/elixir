import { CollectorFacade } from './facades'
import { ElixirFacade } from '../../index'

jest.mock('../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Elixir Collector Facade', () => {
  it ('should return the facade', async () => {
    expect(CollectorFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Collector')
  })
})
