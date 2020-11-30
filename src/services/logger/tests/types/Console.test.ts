import { Severity, SeverityColors } from '../../types'
import { Console } from '../../types/Console'

beforeEach(jest.clearAllMocks)

describe('Elixir Logger: Types: Console', () => {
  it ('can render', () => {
    const c = new Console()

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    c.render(
      'hello',
      Severity.INFO,
      SeverityColors.LEVEL_100,
      '2020-01-01 12:00:00',
      'message',
      { meta: 'data' }
    )

    expect(logSpy).toBeCalledTimes(4)
  })

  it ('can render 2', () => {
    const c = new Console()

    const logSpy = jest.spyOn(console, 'log')

    c.render(
      'hello',
      Severity.INFO,
      SeverityColors.LEVEL_100,
      '2020-01-01 12:00:00',
      'message',
      {}
    )

    expect(logSpy).toBeCalledTimes(2)
  })
})