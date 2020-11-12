import { ElixirLogger } from '../Logger'
import { LogType, Severity, SeverityColors } from '../types'

describe('Elixir Logger', () => {
  it('should instantiate', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)

    expect(logger).toBeInstanceOf(ElixirLogger)
  })

  it ('should be able to log info', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)
    const message: string = 'message'

    logger['render'] = jest.fn()

    const result = logger.info('name', message, {})

    expect(result).toBe(logger)
    expect(logger['render']).toBeCalledTimes(1)
    expect(logger['render']).toBeCalledWith('name', Severity.INFO, SeverityColors.LEVEL_200, message, {})
  })

  it ('should be able to log warn', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)
    const message = 'message'

    logger['render'] = jest.fn()

    const result = logger.warning('name', message, {})

    expect(result).toBe(logger)
    expect(logger['render']).toBeCalledTimes(1)
    expect(logger['render']).toBeCalledWith('name', Severity.WARNING, SeverityColors.LEVEL_400, message, {})
  })

  it ('should be able to log error', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)
    const message = 'message'

    logger['render'] = jest.fn()

    const result = logger.error('name', message, {})

    expect(result).toBe(logger)
    expect(logger['render']).toBeCalledTimes(1)
    expect(logger['render']).toBeCalledWith('name', Severity.ERROR, SeverityColors.LEVEL_500, message, {})
  })

  it ('should be able to log debug', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)
    const message = 'message'

    logger['render'] = jest.fn()

    const result = logger.debug('name', message, {})

    expect(result).toBe(logger)
    expect(logger['render']).toBeCalledTimes(1)
    expect(logger['render']).toBeCalledWith('name', Severity.DEBUG, SeverityColors.LEVEL_100, message, {})
  })

  it ('should render', () => {
    const logger = new ElixirLogger(LogType.CONSOLE)
    const message = 'message'
    console.log = jest.fn()


    logger['render']('name', Severity.INFO, SeverityColors.LEVEL_200, message, {})

    expect(console.log).toBeCalledTimes(2)
  })
})