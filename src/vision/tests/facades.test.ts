import { VisionFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Vision: Facade', () => {
  it ('should return the facade', async () => {
    expect(VisionFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Vision')
  })
})
