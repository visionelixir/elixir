import { DatabaseManagerFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Database Manager Facade', () => {
  it ('should return the facade', async () => {
    expect(DatabaseManagerFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('DatabaseManager')
  })
})
