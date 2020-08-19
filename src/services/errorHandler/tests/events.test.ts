import { ElixirGlobalEvents } from '../../../vision/types'
import { global } from '../events'

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

const Vision = {
  getEmitter: () => Emitter
} as any

beforeEach(() => {
  Emitter.handlers = []
  Emitter.events = []
  jest.clearAllMocks()
})

/**
 * Tests
 */
describe('ErrorHandler: Events', () => {
  it('exports a function', () => {
    expect(global).toBeInstanceOf(Function)
  })

  it('registers the events', () => {
    global(Vision)

    expect(Emitter.on).toBeCalledTimes(1)
  })

  it('handles the INIT_MIDDLEWARE event', () => {
    global(Vision)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirGlobalEvents.INIT_MIDDLEWARE)]

    const middlewareStack = { unshift: jest.fn() }

    const event = {
      getData: () => ({
        middlewareStack,
      })
    }

    handler(event as any)

    expect(middlewareStack.unshift).toBeCalledTimes(1)
  })
})