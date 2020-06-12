import { ViewFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('View: Facade', () => {
  it ('should return the facade', async () => {
    expect(ViewFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('View')
  })
})
