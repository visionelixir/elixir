import { CommandVars } from '../../loaders/CommandVars'

jest.mock('yargs-parser', () => {
  return () => ({
    key: 'value'
  })
})

describe('Environment: CommandVars', () => {
  it('should load', () => {
    const result = CommandVars.load()

    expect(result).toMatchObject({
      key: 'value'
    })
  })
})