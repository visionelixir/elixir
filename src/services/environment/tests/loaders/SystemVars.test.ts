import { SystemVars } from '../../loaders/SystemVars'

describe('Environment: FileVars', () => {
  it('should load', () => {
    const original = process.env
    process.env = {
      key: 'value'
    }

    const result = SystemVars.load()

    expect(result).toMatchObject({
      key: 'value'
    })

    process.env = original
  })
})