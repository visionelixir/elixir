import { Severity, SeverityColors } from '../../types'
import { GCloud } from '../../types/GCloud'

const EntryMock: any = {

}

const LogMock: any = {
  entry: jest.fn(() => EntryMock),
  write: jest.fn(() => { return new Promise(() => {}) })
}



jest.mock('@google-cloud/logging', () => ({
  Logging: class LoggingMock {
    public config: any

    constructor(config: any) {
      this.config = config
    }

    log(name: any) {
      LogMock.name = name

      return LogMock
    }
  },
}))

beforeEach(jest.clearAllMocks)

describe('Elixir Logger: Types: GCloud', () => {
  it ('can render', () => {
    const gCloud = new GCloud({
      projectId: 'application-293301',
      logging: {
        resource: {
          type: 'gae_app',
          labels: {
            module_id: 'ingest-api',
          },
        },
      },
    })

    gCloud.render(
      'name',
      Severity.INFO,
      SeverityColors.LEVEL_100,
      '2020-01-01 12:00:00',
      'message',
      {},
    )

    expect(LogMock.entry).toBeCalledTimes(1)

    expect(LogMock.write).toBeCalledTimes(1)
    expect(LogMock.write).toBeCalledWith(EntryMock)
  })

  it ('can render with http meta', () => {
    const gCloud = new GCloud({
      projectId: 'application-293301',
      logging: {
        resource: {
          type: 'gae_app',
          labels: {
            module_id: 'ingest-api',
          },
        },
      },
    })

    gCloud.render(
      'name',
      Severity.INFO,
      SeverityColors.LEVEL_100,
      '2020-01-01 12:00:00',
      'message',
      {
        performance: [
          {
            "App:Response": 1100,
          }
        ],
        request: [
          {
            status: 200,
            method: 'GET',
            url: 'http://localhost',
            requestSize: 100,
            responseSize: 100,
            cacheLookup: false,
            cacheFillBytes: 0,
            cacheValidatedWithOriginServer: false,
            protocol: 'http',
            referer: 'referrer',
            remoteIp: '127.0.0.1',
            serverIp: '127.0.0.2',
            userAgent: 'jest',
          }
        ]
      },
    )

    expect(LogMock.entry).toBeCalledTimes(1)

    expect(LogMock.write).toBeCalledTimes(1)
    expect(LogMock.write).toBeCalledWith(EntryMock)
  })
})