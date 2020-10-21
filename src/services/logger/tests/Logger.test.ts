import { ElixirLogger } from '../Logger'
import { TypeColors, Types } from '../types'

describe('Elixir Logger', () => {
  it('should instantiate', () => {
    const logger = new ElixirLogger()

    expect(logger).toBeInstanceOf(ElixirLogger)
  })

  it ('should be able to log info', () => {
    const logger = new ElixirLogger()
    const message: string = 'message'

    logger['log'] = jest.fn()

    const result = logger.info(message)

    expect(result).toBe(logger)
    expect(logger['log']).toBeCalledTimes(1)
    expect(logger['log']).toBeCalledWith(Types.INFO, TypeColors.INFO, message)
  })

  it ('should be able to log warn', () => {
    const logger = new ElixirLogger()
    const message = 'message'

    logger['log'] = jest.fn()

    const result = logger.warn(message)

    expect(result).toBe(logger)
    expect(logger['log']).toBeCalledTimes(1)
    expect(logger['log']).toBeCalledWith(Types.WARN, TypeColors.WARN, message)
  })

  it ('should be able to log error', () => {
    const logger = new ElixirLogger()
    const message = 'message'

    logger['log'] = jest.fn()

    const result = logger.error(message)

    expect(result).toBe(logger)
    expect(logger['log']).toBeCalledTimes(1)
    expect(logger['log']).toBeCalledWith(Types.ERROR, TypeColors.ERROR, message)
  })

  it ('should be able to log debug', () => {
    const logger = new ElixirLogger()
    const message = 'message'

    logger['log'] = jest.fn()

    const result = logger.debug(message)

    expect(result).toBe(logger)
    expect(logger['log']).toBeCalledTimes(1)
    expect(logger['log']).toBeCalledWith(Types.DEBUG, TypeColors.DEBUG, message)
  })

  it ('should log', () => {
    const logger = new ElixirLogger()
    const message = 'message'
    console.info = jest.fn()


    logger['log'](Types.INFO, TypeColors.DEBUG, message)

    expect(console.info).toBeCalledTimes(1)
  })

  it ('should pretty log an object', () => {
    const logger = new ElixirLogger()
    const message = { my: 'object' }
    console.info = jest.fn()


    logger['log'](Types.INFO, TypeColors.DEBUG, message)

    expect(console.info).toBeCalledTimes(3)
  })
})