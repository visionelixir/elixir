import { CollectorFacade } from '../facades'
import { ElixirFacade } from '../../../vision/Facade'

jest.mock('../../../vision/Facade', require('../../../vision/mocks/Facade').ElixirFacadeMock)

describe('Collector Facade', () => {
  it ('should return the facade', async () => {
    expect(CollectorFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Collector')
  })
})
