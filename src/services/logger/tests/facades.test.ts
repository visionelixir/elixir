import { LoggerFacade } from '../facades'
import { ElixirFacade } from '../../..'

jest.mock('../../..', () => ({
  ElixirFacade: jest.fn()
}))

describe('Logger Facade', () => {
  it ('should return the facade', async () => {
    expect(LoggerFacade).toBeInstanceOf(ElixirFacade)
    expect(ElixirFacade).toBeCalledWith('Logger')
  })
})
