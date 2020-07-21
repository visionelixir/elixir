import { ViewFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('View: Facade', () => {
  it ('should return the facade', async () => {
    expect(ViewFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('View')
  })
})
