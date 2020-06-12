import { PerformanceFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Performance Facade', () => {
  it ('should return the facade', async () => {
    expect(PerformanceFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Performance')
  })
})
