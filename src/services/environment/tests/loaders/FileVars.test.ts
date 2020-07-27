import { FileVars } from '../../loaders/FileVars'

jest.mock('fs', () => {
  return {
    readFileSync: jest.fn(() => {
      return `KEY=value
      
      KEY2=value 2
       KEY3=value 3`
    })
  }
})

describe('Environment: FileVars', () => {
  it('should load', () => {
    const result = FileVars.load()

    expect(result).toMatchObject({
      KEY: 'value',
      KEY2: 'value 2',
      KEY3: 'value 3'
    })
  })
})