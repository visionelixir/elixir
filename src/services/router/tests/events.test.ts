import { ElixirGlobalEvents } from '../../../vision/types'
import { global } from '../events'

jest.mock('../boot', () => ({
  RouterInstance: {
    getCore: () => ({
      allowedMethods: () => async () => {},
      routes: () => async () => {}
    })
  }
}))

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
describe('Collector: Events', () => {
  it('exports a function as global', () => {
    expect(global).toBeInstanceOf(Function)
  })

  it('registers the events', () => {
    global(Vision)

    expect(Emitter.on).toBeCalledTimes(1)
  })

  it('handles the INIT_MIDDLEWARE event', () => {
    global(Vision)

    const handler = Emitter.handlers[Emitter.events.indexOf(ElixirGlobalEvents.INIT_MIDDLEWARE)]

    const middlewareStack = { push: jest.fn() }

    const event = {
      getData: () => ({
        middlewareStack,
      })
    }

    handler(event as any)

    expect(middlewareStack.push).toBeCalledTimes(2)
  })
})