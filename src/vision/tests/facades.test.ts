import { VisionFacade } from '../facades'
import { ElixirFacade } from '../Facade'

jest.mock('../Facade', require('../mocks/Facade').ElixirFacadeMock)

describe('Vision: Facade', () => {
  it ('should return the facade', async () => {
    expect(VisionFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Vision')
  })
})
