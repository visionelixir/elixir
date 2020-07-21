import { LoggerFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('Logger Facade', () => {
  it ('should return the facade', async () => {
    expect(LoggerFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Logger')
  })
})
