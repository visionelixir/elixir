import { VisionConfig } from '../../../vision/types'
import { ElixirConfig } from '../Config'
import { ElixirLoader } from '../../../utils/Loader'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../utils/Loader', require('../../../utils/mocks/Loader').ElixirLoaderMock)

const ElixirLoaderMocked = mocked(new ElixirLoader({} as VisionConfig), true)

beforeEach(jest.clearAllMocks)

describe('Elixir Config', () => {
  it ('should instantiate', () => {
    const config = new ElixirConfig(new ElixirLoader({} as VisionConfig))

    expect(config).toBeInstanceOf(ElixirConfig)
  })

  it ('should get a config', () => {
    const myConfig = {
      key: 'value'
    }

    ElixirLoaderMocked.loadConfig.mockImplementationOnce(() => myConfig)

    const Config = new ElixirConfig(ElixirLoaderMocked as unknown as ElixirLoader)

    const config = Config.get('someName')

    expect(ElixirLoaderMocked.loadConfig).toBeCalledTimes(1)
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

    ElixirLoaderMocked.loadConfig.mockImplementationOnce(() => myConfig)
    ElixirLoaderMocked.loadServiceAsset.mockImplementationOnce(() => serviceConfig)

    const Config = new ElixirConfig(ElixirLoaderMocked as unknown as ElixirLoader)

    const config = Config.get('someName', 'service')

    expect(ElixirLoaderMocked.loadConfig).toBeCalledTimes(1)
    expect(config).toMatchObject(expected)
  })
})
