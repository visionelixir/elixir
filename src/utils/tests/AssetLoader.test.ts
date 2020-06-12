import { AssetLoader } from '../AssetLoader'
import * as elixir from '../../'
import { VisionElixirEnvironment } from '../../'

beforeEach(jest.clearAllMocks)

const ContainerManagerGetMock = jest.fn()

// @ts-ignore
elixir['ContainerManager'] = {
  get: () => ({
    resolve: ContainerManagerGetMock
  })
} as any

describe('Utils:AssetLoader', () => {
  it ('can get the vision config', () => {
    const config = { a: 'a' }
    ContainerManagerGetMock.mockImplementationOnce(() => config)
    const result = AssetLoader.getVisionConfig()

    expect(result).toBe(config)
  })

  it ('can get the elixir config', () => {
    const result = AssetLoader.getElixirConfig()

    expect(result).toHaveProperty('baseDirectory')
    expect(result).toHaveProperty('configDirectory')
    expect(result).toHaveProperty('services')
  })

  it ('can get config by environment type', () => {
    const config = { a: 'a' }
    ContainerManagerGetMock.mockImplementationOnce(() => config)
    const resultVision = AssetLoader.getConfig(VisionElixirEnvironment.VISION)

    expect(resultVision).toBe(config)

    const resultElixir = AssetLoader.getConfig(VisionElixirEnvironment.ELIXIR)

    expect(resultElixir).toHaveProperty('baseDirectory')
    expect(resultElixir).toHaveProperty('configDirectory')
    expect(resultElixir).toHaveProperty('services')
  })

  it ('can load a config', () => {
    const originalLoadAsset = AssetLoader.loadAsset
    AssetLoader['loadAsset'] = jest.fn()

    AssetLoader.loadConfig(VisionElixirEnvironment.ELIXIR, 'something')

    expect(AssetLoader.loadAsset).toBeCalledTimes(1)
    expect(AssetLoader.loadAsset).toBeCalledWith(expect.stringContaining('/'), true)

    AssetLoader['loadAsset'] = originalLoadAsset
  })

  it ('can load all service events', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalRequireServiceAsset = AssetLoader.runServiceAsset

    AssetLoader['getConfig'] = jest.fn(() => ({
      services: {
        require: [
          'a', 'b', 'c'
        ]
      }
    }) as any)

    AssetLoader['runServiceAsset'] = jest.fn()

    AssetLoader.loadAllServiceEvents(VisionElixirEnvironment.ELIXIR)

    expect(AssetLoader.runServiceAsset).toBeCalledTimes(3)

    AssetLoader['getConfig'] = originalGetConfig
    AssetLoader['runServiceAsset'] = originalRequireServiceAsset
  })

  it ('can load all service routes', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalRequireServiceAsset = AssetLoader.runServiceAsset

    AssetLoader['getConfig'] = jest.fn(() => ({
      services: {
        require: [
          'a', 'b', 'c'
        ]
      }
    }) as any)

    AssetLoader['runServiceAsset'] = jest.fn()

    AssetLoader.loadAllServiceRoutes(VisionElixirEnvironment.ELIXIR)

    expect(AssetLoader.runServiceAsset).toBeCalledTimes(3)

    AssetLoader['getConfig'] = originalGetConfig
    AssetLoader['runServiceAsset'] = originalRequireServiceAsset
  })

  it ('can run all service setup files', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalLoadServiceAsset = AssetLoader.loadServiceAsset
    const run = jest.fn()

    AssetLoader['loadServiceAsset'] = jest.fn(() => class {
      public run() { run() }
    })

    AssetLoader['getConfig'] = jest.fn(() => ({
      services: {
        setupFile: 'Setup',
        require: [
          'a', 'b', 'c'
        ]
      }
    }) as any)

    AssetLoader.runAllServiceSetupFiles(VisionElixirEnvironment.ELIXIR)

    expect(AssetLoader.loadServiceAsset).toBeCalledTimes(3)
    expect(AssetLoader.loadServiceAsset).toBeCalledWith('elixir', 'a', 'Setup', true)
    expect(AssetLoader.loadServiceAsset).toBeCalledWith('elixir', 'b', 'Setup', true)
    expect(AssetLoader.loadServiceAsset).toBeCalledWith('elixir', 'c', 'Setup', true)

    expect(run).toBeCalledTimes(3)

    AssetLoader['loadServiceAsset'] = originalLoadServiceAsset
    AssetLoader['getConfig'] = originalGetConfig
  })

  it ('should not error if the setup class does not exist', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalLoadServiceAsset = AssetLoader.loadServiceAsset

    AssetLoader['loadServiceAsset'] = jest.fn(() => null)

    AssetLoader['getConfig'] = jest.fn(() => ({
      services: {
        setupFile: 'Setup',
        require: [
          'a'
        ]
      }
    }) as any)

    expect(() => {
      AssetLoader.runAllServiceSetupFiles(VisionElixirEnvironment.ELIXIR)
    }).toThrowError()

    AssetLoader['loadServiceAsset'] = originalLoadServiceAsset
    AssetLoader['getConfig'] = originalGetConfig
  })

  it ('should not error if the setup file does not exist', () => {
    const originalGetConfig = AssetLoader.getConfig

    AssetLoader['getConfig'] = jest.fn(() => ({
      services: {
        setupFile: 'Setup',
        require: [
          'a'
        ]
      }
    }) as any)

    expect(() => {
      AssetLoader.runAllServiceSetupFiles(VisionElixirEnvironment.ELIXIR)
    }).not.toThrowError()

    AssetLoader['getConfig'] = originalGetConfig
  })

  it ('can load a service asset', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalLoadAsset = AssetLoader.loadAsset

    AssetLoader['loadAsset'] = jest.fn()

    AssetLoader['getConfig'] = jest.fn(() => ({
      baseDirectory: 'baseDir',
      services: {
        directory: 'services',
        setupFile: 'Setup'
      }
    }) as any)

    AssetLoader.loadServiceAsset(VisionElixirEnvironment.ELIXIR, 'test-service', 'file', false)

    expect(AssetLoader.loadAsset).toBeCalledTimes(1)
    expect(AssetLoader.loadAsset).toBeCalledWith('baseDir/services/test-service/file', false)

    AssetLoader.getConfig = originalGetConfig
    AssetLoader.loadAsset = originalLoadAsset
  })

  it ('can load a default exported service asset', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalLoadAsset = AssetLoader.loadAsset

    AssetLoader['loadAsset'] = jest.fn()

    AssetLoader['getConfig'] = jest.fn(() => ({
      baseDirectory: 'baseDir',
      services: {
        directory: 'services',
        setupFile: 'Setup'
      }
    }) as any)

    AssetLoader.loadServiceAsset(VisionElixirEnvironment.ELIXIR, 'test-service', 'file', true)

    expect(AssetLoader.loadAsset).toBeCalledTimes(1)
    expect(AssetLoader.loadAsset).toBeCalledWith('baseDir/services/test-service/file', true)

    AssetLoader.getConfig = originalGetConfig
    AssetLoader.loadAsset = originalLoadAsset
  })

  it ('does not load a default exported service asset by default', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalLoadAsset = AssetLoader.loadAsset

    AssetLoader['loadAsset'] = jest.fn()

    AssetLoader['getConfig'] = jest.fn(() => ({
      baseDirectory: 'baseDir',
      services: {
        directory: 'services',
        setupFile: 'Setup'
      }
    }) as any)

    AssetLoader.loadServiceAsset(VisionElixirEnvironment.ELIXIR, 'test-service', 'file')

    expect(AssetLoader.loadAsset).toBeCalledTimes(1)
    expect(AssetLoader.loadAsset).toBeCalledWith('baseDir/services/test-service/file', false)

    AssetLoader.getConfig = originalGetConfig
    AssetLoader.loadAsset = originalLoadAsset
  })

  it ('can run a service asset', () => {
    const originalGetConfig = AssetLoader.getConfig
    const originalRunAsset = AssetLoader.runAsset

    AssetLoader['runAsset'] = jest.fn()

    AssetLoader['getConfig'] = jest.fn(() => ({
      baseDirectory: 'baseDir',
      services: {
        directory: 'services',
        setupFile: 'Setup'
      }
    }) as any)

    AssetLoader.runServiceAsset(VisionElixirEnvironment.ELIXIR, 'test-service', 'file')

    expect(AssetLoader.runAsset).toBeCalledTimes(1)
    expect(AssetLoader.runAsset).toBeCalledWith('baseDir/services/test-service/file')

    AssetLoader.getConfig = originalGetConfig
    AssetLoader.runAsset = originalRunAsset
  })

  it ('can load an asset', () => {
    const originalRequire = AssetLoader['require']
    const module = {}

    AssetLoader['require'] = jest.fn(() => module)

    const result = AssetLoader.loadAsset('file')

    expect(AssetLoader['require']).toBeCalledTimes(1)
    expect(AssetLoader['require']).toBeCalledWith('file')
    expect(result).toBe(module)

    AssetLoader['require'] = originalRequire
  })

  it ('can load an asset and get the default export', () => {
    const originalRequire = AssetLoader['require']
    const module = {
      default: {}
    }

    AssetLoader['require'] = jest.fn(() => module)

    const result = AssetLoader.loadAsset('file', true)

    expect(AssetLoader['require']).toBeCalledTimes(1)
    expect(AssetLoader['require']).toBeCalledWith('file')
    expect(result).toBe(module.default)

    AssetLoader['require'] = originalRequire
  })

  it ('can run an asset', () => {
    const originalRequire = AssetLoader['require']
    const module = jest.fn()

    AssetLoader['require'] = jest.fn(() => module())

    AssetLoader.runAsset('file')

    expect(AssetLoader['require']).toBeCalledTimes(1)
    expect(AssetLoader['require']).toBeCalledWith('file')
    expect(module).toBeCalledTimes(1)

    AssetLoader['require'] = originalRequire
  })

  it ('can require run modules', () => {
    AssetLoader['require']('../test/fixtures/modules/run')

    expect.assertions(1)
  })

  it ('can return a loaded module', () => {
    const result = AssetLoader['require']('../test/fixtures/modules/export')

    expect(result).toMatchObject({})
  })
})
