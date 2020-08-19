import { mocked } from 'ts-jest/utils'
import { TEST_VISION_CONFIG } from '../../../test/fixtures/vision/config'
import boot from '../boot'
import * as nunjucks from 'nunjucks'

jest.mock('nunjucks')

const nunjucksMocked = mocked(nunjucks)

const Loader = {
  getVisionConfig: () => TEST_VISION_CONFIG,
  loadConfig: jest.fn(),
}

const ctx = {
  elixir: {
    services: () => Loader
  }
} as any

describe('View: Boot', () => {
  it ('should not do anything if the view config cant be loaded', () => {
    boot(ctx)
  })

  it('should set up the view service', () => {
    Loader.loadConfig.mockImplementationOnce(() => ({
      serviceViewDirectory: 'views',
      themesDirectory: 'themes',
      themeFallback: ['mySite', 'base'],
    }))

    let paths: any

    const configureMock = (path: any, _options: any) => {
      paths = path
    }

    nunjucksMocked.configure.mockImplementationOnce(configureMock as any)

    boot(ctx)

    expect(nunjucks.configure).toBeCalledTimes(1)
    expect(paths).toHaveLength(3)
    expect(paths).toEqual([
      expect.stringContaining('themes/mySite'),
      expect.stringContaining('themes/base'),
      expect.stringContaining('services/core/views'),
    ])
  })
})
