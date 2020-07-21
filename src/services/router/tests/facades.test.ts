import { RouterFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('Router: Facade', () => {
  it ('should return the facade', async () => {
    expect(RouterFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Router')
  })
})
