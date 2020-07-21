import { DatabaseManagerFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('Database Manager Facade', () => {
  it ('should return the facade', async () => {
    expect(DatabaseManagerFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('DatabaseManager')
  })
})
