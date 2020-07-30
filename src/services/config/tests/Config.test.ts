import { ElixirConfig } from '../Config'
import { AssetLoader } from '../../../utils/AssetLoader'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../utils/AssetLoader', require('../../../utils/mocks/AssetLoader').AssetLoaderMock)

const AssetLoaderMocked = mocked(AssetLoader, true)

beforeEach(jest.clearAllMocks)

describe('Elixir Config', () => {
  it ('should instantiate', () => {
    const config = new ElixirConfig()

    expect(config).toBeInstanceOf(ElixirConfig)
  })

  it ('should get a config', () => {
    const myConfig = {
      key: 'value'
    }

    AssetLoaderMocked.loadConfig.mockImplementationOnce(() => myConfig)

    const Config = new ElixirConfig()

    const config = Config.get('someName')

    expect(AssetLoaderMocked.loadConfig).toBeCalledTimes(1)
    expect(config).toMatchObject(myConfig)
  })

  it ('should merge a service config', () => {
    const myConfig = {
      key: 'mine'
    }

    const serviceConfig = {
      key: 'service',
      another: 'value'
    }

    const expected = {
      key: 'mine',
      another: 'value',
    }

    AssetLoaderMocked.loadConfig.mockImplementationOnce(() => myConfig)
    AssetLoaderMocked.loadServiceAsset.mockImplementationOnce(() => serviceConfig)

    const Config = new ElixirConfig()

    const config = Config.get('someName', 'service')

    expect(AssetLoaderMocked.loadConfig).toBeCalledTimes(1)
    expect(config).toMatchObject(expected)
  })
})
