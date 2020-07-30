import { FileVars } from '../../loaders/FileVars'
import * as fs from 'fs'
import * as yargsParser from 'yargs-parser'
import { mocked } from 'ts-jest/utils'

jest.mock('yargs-parser', () => jest.fn(() => ({})))
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => `KEY=value
      
      KEY2=value 2
       KEY3=value 3`)
}))

const yargsMocked = mocked(yargsParser, true)
const fsMocked = mocked(fs, true)

beforeEach(jest.clearAllMocks)

describe('Environment: FileVars', () => {
  it('should load', () => {
    const result = FileVars.load()

    expect(result).toMatchObject({
      KEY: 'value',
      KEY2: 'value 2',
      KEY3: 'value 3'
    })
  })

  it('should be fine with an empty first line', () => {
    fsMocked.readFileSync.mockImplementation(() => `
    
      KEY=value
      
      KEY2=value 2
        KEY3=value 3`)

    const result = FileVars.load()

    expect(result).toMatchObject({
      KEY: 'value',
      KEY2: 'value 2',
      KEY3: 'value 3'
    })

    fsMocked.readFileSync.mockImplementation(() => `KEY=value
      
      KEY2=value 2
       KEY3=value 3`)
  })

  it('should be fine with an empty file', () => {
    fsMocked.readFileSync.mockImplementation(() => ``)

    const result = FileVars.load()

    expect(result).toMatchObject({})

    fsMocked.readFileSync.mockImplementation(() => `KEY=value
      
      KEY2=value 2
       KEY3=value 3`)

  })

  it('should load from the base directory if set in env', () => {
    process.env.baseDirectory = 'fromEnv'

    const result = FileVars.load()

    expect(fsMocked.readFileSync).toBeCalledWith(expect.stringContaining('fromEnv'))

    expect(result).toMatchObject({
      KEY: 'value',
      KEY2: 'value 2',
      KEY3: 'value 3'
    })

    delete process.env.baseDirectory
  })

  it('should load from the base directory if set in args', () => {
    yargsMocked.mockImplementation(() => ({ baseDirectory: 'fromArgs' } as any))

    const result = FileVars.load()

    expect(fsMocked.readFileSync).toBeCalledWith(expect.stringContaining('fromArgs'))

    expect(result).toMatchObject({
      KEY: 'value',
      KEY2: 'value 2',
      KEY3: 'value 3'
    })
  })

  it ('should not fail if the environment file is not found', () => {
    fsMocked.readFileSync.mockImplementation(() => {
      throw new Error()
    })

    expect(fsMocked.readFileSync).toThrowError()
    expect(() => FileVars.load()).not.toThrowError()

    fsMocked.readFileSync.mockImplementation(() => `KEY=value
      
      KEY2=value 2
       KEY3=value 3`)
  })
})