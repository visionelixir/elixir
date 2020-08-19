import { StringUtil } from '../StringUtil'

describe('Utils: StringUtil', () => {
  it ('can generate an id', () => {
    const result = StringUtil.id()

    expect(typeof result).toBe('string')
  })

  it ('can generate an id with a prefix', () => {
    const prefix = 'id'
    const result = StringUtil.id(prefix)

    expect(typeof result).toBe('string')
    expect(result.startsWith(prefix)).toBeTruthy()
  })
})