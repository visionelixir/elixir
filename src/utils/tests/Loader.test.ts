import { TEST_VISION_CONFIG } from '../../test/fixtures/vision/config'
import { ELIXIR_CONFIG } from '../../vision/config'
import { VisionElixirEnvironment } from '../../vision/types'
import { ElixirLoader } from '../Loader'

const loader = new ElixirLoader(TEST_VISION_CONFIG)

describe('Loader', () => {
  it('instantiates', () => {
    expect(loader).toBeInstanceOf(ElixirLoader)
  })

  it('returns the vision config', () => {
    expect(loader.getVisionConfig()).toBe(TEST_VISION_CONFIG)
  })

  it ('returns the elixir config', () => {
    expect(loader.getElixirConfig()).toBe(ELIXIR_CONFIG)
  })

  it ('can get config by environment type', () => {
    expect(loader.getConfig(VisionElixirEnvironment.VISION)).toBe(TEST_VISION_CONFIG)
    expect(loader.getConfig(VisionElixirEnvironment.ELIXIR)).toBe(ELIXIR_CONFIG)
  })

  it ('can load a config', () => {
    const originalLoadAsset = loader.loadAsset
    loader['loadAsset'] = jest.fn(() => ({ default: {} }))

    loader.loadConfig(VisionElixirEnvironment.ELIXIR, 'something')

    expect(loader.loadAsset).toBeCalledTimes(1)
    expect(loader.loadAsset).toBeCalledWith(expect.stringContaining('/'))

    loader['loadAsset'] = originalLoadAsset
  })

  it ('can run an export of a file across all services', () => {
    const originalLoadAsset = loader.loadAsset
    loader['loadAsset'] = jest.fn(() => ({ default: jest.fn() }))

    loader.runAllServiceFileExports('file', VisionElixirEnvironment.ELIXIR, [], 'default')

    expect(loader.loadAsset).toBeCalledTimes(12)
    expect(loader.loadAsset).toBeCalledWith(expect.stringContaining('/'))

    loader['loadAsset'] = originalLoadAsset
  })

  it ('can run an export of a file across all services even if some dont have one', () => {
    const originalLoadAsset = loader.loadAsset
    loader['loadAsset'] = jest.fn(() => { throw new Error() })

    loader.runAllServiceFileExports('file', VisionElixirEnvironment.ELIXIR)

    expect(loader.loadAsset).toBeCalledTimes(12)
    expect(loader.loadAsset).toBeCalledWith(expect.stringContaining('/'))

    loader['loadAsset'] = originalLoadAsset
  })

  it ('can run an export of a file across all services with params', () => {
    const originalLoadAsset = loader.loadAsset
    const calls = jest.fn()

    loader['loadAsset'] = jest.fn(() => ({
      something: calls
    }))

    loader.runAllServiceFileExports('file', VisionElixirEnvironment.ELIXIR, [ 'some param' ], 'something')

    expect(loader.loadAsset).toBeCalledTimes(12)
    expect(loader.loadAsset).toBeCalledWith(expect.stringContaining('/'))
    expect(calls).toBeCalledTimes(12)
    expect(calls).toBeCalledWith('some param')

    loader['loadAsset'] = originalLoadAsset
  })

  it ('can run an export of a file across all services even if the export doesnt exist', () => {
    const originalLoadAsset = loader.loadAsset
    const calls = jest.fn()

    loader['loadAsset'] = jest.fn(() => ({
      bob: calls
    }))

    loader.runAllServiceFileExports('file', VisionElixirEnvironment.ELIXIR, [ 'some param' ], 'default')

    expect(loader.loadAsset).toBeCalledTimes(12)
    expect(loader.loadAsset).toBeCalledWith(expect.stringContaining('/'))
    expect(calls).not.toBeCalled()

    loader['loadAsset'] = originalLoadAsset
  })

  it ('can require run modules', () => {
    loader['require']('../test/fixtures/modules/run')

    expect.assertions(1)
  })

  it ('can return a loaded module', () => {
    const result = loader['require']('../test/fixtures/modules/export')

    expect(result).toMatchObject({})
  })

  it ('can load an asset', () => {
    const originalRequire = loader['require']
    const module = {}

    loader['require'] = jest.fn(() => module)

    const result = loader.loadAsset('file')

    expect(loader['require']).toBeCalledTimes(1)
    expect(loader['require']).toBeCalledWith('file')
    expect(result).toBe(module)

    loader['require'] = originalRequire
  })
})