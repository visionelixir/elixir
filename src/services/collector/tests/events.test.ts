import { ElixirEvents } from '../../../vision/types'
import { ElixirEvent } from '../../events/Event'
import events from '../events'

/**
 * Mocks
 */
const Emitter: {handlers: any[], events: string[], on: any, emit: any} = {
  handlers: [],
  events: [],
  on: jest.fn((event: any, handler: any) => {
    Emitter.handlers.push(handler)
    Emitter.events.push(event)
  }),
  emit: jest.fn()
}

const Logger = {
  info: jest.fn(),
  debug: jest.fn(),
}

const Collector = {
  add: jest.fn(),
  all: jest.fn(),
}

const ctx = {
  elixir: {
    services: () => ({
      Emitter,
      Collector,
      Logger
    })
  },
  request: {
    method: 'GET',
    url: 'some/url'
  },
  response: {
    status: 200
  }
} as any

beforeEach(() => {
  Emitter.handlers = []
  Emitter.events = []
  jest.clearAllMocks()
})

/**
 * Tests
 */
describe('Collector: Events', () => {
  it('exports a function', () => {
    expect(events).toBeInstanceOf(Function)
  })

  it('registers the events', () => {
    events(ctx)

    expect(Emitter.on).toBeCalledTimes(2)
  })

  it('handles the APP_DATA event', () => {
    events(ctx)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirEvents.APP_DATA)]

    const event = {
      getData: () => ({
        collection: 'some collection',
        payload: 'some payload',
      })
    }

    handler(event as any)

    expect(Collector.add).toBeCalledTimes(1)
    expect(Collector.add).toBeCalledWith('some collection', 'some payload')
  })

  it('handles the RESPONSE_POST event', async () => {
    events(ctx)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirEvents.RESPONSE_POST)]

    const event = {
      getData: () => ({
        ctx,
      })
    }

    await handler(event as any)

    expect(Emitter.emit).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(ElixirEvents.APP_DATA, expect.any(ElixirEvent))

    expect(Logger.info).toBeCalledTimes(1)
    expect(Logger.debug).toBeCalledTimes(1)

    expect(Collector.all).toBeCalledTimes(1)
  })
})