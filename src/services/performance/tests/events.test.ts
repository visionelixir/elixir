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

const Performance = {
  get: jest.fn(),
  stop: jest.fn(),
  start: jest.fn(),
  clearAll: jest.fn(),
  allArray: jest.fn(),
}

const ctx = {
  elixir: {
    services: (...args: string[]) => {
      if (args.length > 1) {
        return { Emitter, Performance }
      }

      switch (args[0]) {
        case 'Emitter' :
          return Emitter
        case 'Performance' :
          return Performance
      }

      return
    }
  },
  request: {
    method: 'GET',
    url: 'some/url'
  },
  response: {
    status: 200
  },
  set: jest.fn()
} as any

beforeEach(() => {
  Emitter.handlers = []
  Emitter.events = []
  jest.clearAllMocks()
})

/**
 * Tests
 */
describe('Performance: Events', () => {
  it('exports a function', () => {
    expect(events).toBeInstanceOf(Function)
  })

  it('registers the events', () => {
    events(ctx)

    expect(Emitter.on).toBeCalledTimes(2)
  })

  it('handles the RESPONSE_PRE event', () => {
    events(ctx)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirEvents.RESPONSE_PRE)]

    const event = {
      getData: () => ({ ctx })
    }

    handler(event as any)

    expect(Performance.clearAll).toBeCalledTimes(1)
    expect(Performance.start).toBeCalledTimes(1)
    expect(Performance.start).toBeCalledWith('App:Response')
  })

  it('handles the RESPONSE_POST event', async () => {
    Performance.allArray.mockImplementationOnce(() => [
      {
        getName: () => 'name',
        getDuration: () => 12345678,
        stop: jest.fn(),
      }
    ])

    Performance.get.mockImplementationOnce(() => ({
        getName: () => 'name',
        getDuration: () => 12345678,
        stop: jest.fn(),
      }))

    events(ctx)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirEvents.RESPONSE_POST)]

    const event = {
      getData: () => ({ ctx })
    }

    await handler(event as any)

    expect(Emitter.emit).toBeCalledTimes(1)
    expect(Emitter.emit).toBeCalledWith(ElixirEvents.APP_DATA, expect.any(ElixirEvent))

    expect(ctx.set).toBeCalledTimes(1)
    expect(ctx.set).toBeCalledWith('x-elixir-response-time', expect.any(String))

    expect(Performance.stop).toBeCalledTimes(1)
    expect(Performance.stop).toBeCalledWith('App:Response')
    expect(Performance.allArray).toBeCalledTimes(1)
  })
})