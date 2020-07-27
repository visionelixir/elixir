import * as elixir from '../../../..'
import { responsePre } from '../../listeners/ResponsePre'

jest.mock('../../facades', require('../../mocks/facades').PerformanceFacadeMock)

beforeEach(jest.clearAllMocks)

describe('Performance: Listeners: ResponsePost', () => {
  it ('clears performance', async () => {
    await responsePre()

    expect(elixir.PerformanceFacade.clearAll).toBeCalledTimes(1)
    expect(elixir.PerformanceFacade.clearAll).toBeCalledWith()
  })

  it ('starts the app response timer', async () => {
    await responsePre()

    expect(elixir.PerformanceFacade.start).toBeCalledTimes(1)
    expect(elixir.PerformanceFacade.start).toBeCalledWith('App:Response')
  })
})