import { CollectorFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Collector Facade', () => {
  it ('should return the facade', async () => {
    expect(CollectorFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Collector')
  })
})
