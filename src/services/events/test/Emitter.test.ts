import { ElixirEmitter } from '../Emitter'
import { ElixirEvent } from '../Event'
import { EventScope } from '../types'

beforeEach(() => {
  new ElixirEmitter().clearAll(EventScope.GLOBAL)
  jest.clearAllMocks()
})

describe('Event Dispatcher', () => {
  it('can be instantiated', () => {
    const emitter = new ElixirEmitter()

    expect(emitter).toBeInstanceOf(ElixirEmitter)
  })

  it('can get the emitter by scope', () => {
    const emitter = new ElixirEmitter()

    const l = emitter.getEmitter(EventScope.LOCAL)
    const g = emitter.getEmitter(EventScope.GLOBAL)
    const d = emitter.getEmitter()

    expect(l).toBe(d)
    expect(g).not.toBe(d)
    expect(g).not.toBe(l)
  })

  it('can add a local event listener', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.LOCAL)
    const addListenerSpy = jest.spyOn(nodeEmitter, 'addListener')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    expect(addListenerSpy).toBeCalledTimes(1)
    expect(addListenerSpy).toBeCalledWith(event, listener)
    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(1)
    expect(emitter.getListeners(event, EventScope.GLOBAL)).toHaveLength(0)
  })

  it('can add a global event listener', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.GLOBAL)
    const addListenerSpy = jest.spyOn(nodeEmitter, 'addListener')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.GLOBAL)

    expect(addListenerSpy).toBeCalledTimes(1)
    expect(addListenerSpy).toBeCalledWith(event, listener)
    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(0)
    expect(emitter.getListeners(event, EventScope.GLOBAL)).toHaveLength(1)
  })

  it('adds a local event listener by default', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.LOCAL)
    const addListenerSpy = jest.spyOn(nodeEmitter, 'addListener')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener)

    expect(addListenerSpy).toBeCalledTimes(1)
    expect(addListenerSpy).toBeCalledWith(event, listener)
    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(1)
    expect(emitter.getListeners(event, EventScope.GLOBAL)).toHaveLength(0)
  })

  it('can remove a local listener',  () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.LOCAL)
    const removeListenerSpy = jest.spyOn(nodeEmitter, 'addListener')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener)

    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(1)

    emitter.off(event, listener)

    expect(removeListenerSpy).toBeCalledTimes(1)
    expect(removeListenerSpy).toBeCalledWith(event, listener)
    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(0)
  })

  it('can remove a global listener',  () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.GLOBAL)
    const removeListenerSpy = jest.spyOn(nodeEmitter, 'addListener')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.GLOBAL)

    expect(emitter.getListeners(event, EventScope.GLOBAL)).toHaveLength(1)

    emitter.off(event, listener, EventScope.GLOBAL)

    expect(removeListenerSpy).toBeCalledTimes(1)
    expect(removeListenerSpy).toBeCalledWith(event, listener)
    expect(emitter.getListeners(event, EventScope.LOCAL)).toHaveLength(0)
  })

  it ('can get the listening local event names', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.LOCAL)
    const eventsSpy = jest.spyOn(nodeEmitter, 'eventNames')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    const events = emitter.getNames(EventScope.LOCAL)
    const globalEvents = emitter.getNames(EventScope.GLOBAL)

    expect(eventsSpy).toBeCalledTimes(1)
    expect(events).toEqual([ event ])
    expect(globalEvents).toEqual([])
  })

  it ('can get the listening global event names', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.GLOBAL)
    const eventsSpy = jest.spyOn(nodeEmitter, 'eventNames')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.GLOBAL)

    const events = emitter.getNames(EventScope.LOCAL)
    const globalEvents = emitter.getNames(EventScope.GLOBAL)

    expect(eventsSpy).toBeCalledTimes(1)
    expect(events).toEqual([  ])
    expect(globalEvents).toEqual([ event ])
  })

  it ('can get the listening local event names by default', () => {
    const emitter = new ElixirEmitter()
    const nodeEmitter = emitter.getEmitter(EventScope.LOCAL)
    const eventsSpy = jest.spyOn(nodeEmitter, 'eventNames')

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    const events = emitter.getNames()
    const globalEvents = emitter.getNames(EventScope.GLOBAL)

    expect(eventsSpy).toBeCalledTimes(1)
    expect(events).toEqual([ event ])
    expect(globalEvents).toEqual([])
  })

  it ('can get the local listeners for an event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    const listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([ listener ])
  })

  it ('can get the global listeners for an event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.GLOBAL)

    const listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([ listener ])
  })

  it ('can get the local listeners for an event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    const listeners = emitter.getListeners(event)

    expect(listeners).toEqual([ listener ])
  })

  it ('can clear a local event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    let listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([ listener ])

    emitter.clear(event, EventScope.LOCAL)

    listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([])
  })

  it ('can clear a global event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.GLOBAL)

    let listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([ listener ])

    emitter.clear(event, EventScope.GLOBAL)

    listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([])
  })

  it ('can clear a local event by default', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)

    let listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([ listener ])

    emitter.clear(event)

    listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([])
  })

  it ('can emit a local event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const eventObj = new ElixirEvent({ hello: 'world' })
    let calledWithData: ElixirEvent | null = null

    const listener = jest.fn((data: ElixirEvent): void => {
      calledWithData = data
    })

    emitter.on(event, listener, EventScope.LOCAL)
    emitter.emit(event, eventObj, EventScope.LOCAL)

    expect(listener).toBeCalledTimes(1)
    expect(calledWithData).toBe(eventObj)
  })

  it ('can emit a global event', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const eventObj = new ElixirEvent({ hello: 'world' })
    let calledWithData: ElixirEvent | null = null

    const listener = jest.fn((data: ElixirEvent): void => {
      calledWithData = data
    })

    emitter.on(event, listener, EventScope.GLOBAL)
    emitter.emit(event, eventObj, EventScope.GLOBAL)

    expect(listener).toBeCalledTimes(1)
    expect(calledWithData).toBe(eventObj)
  })

  it ('can emit a local event by default', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const eventObj = new ElixirEvent({ hello: 'world' })
    let calledWithData: ElixirEvent | null = null

    const listener = jest.fn((data: ElixirEvent): void => {
      calledWithData = data
    })

    emitter.on(event, listener, EventScope.LOCAL)
    emitter.emit(event, eventObj)

    expect(listener).toBeCalledTimes(1)
    expect(calledWithData).toBe(eventObj)
  })

  it ('can clear all by scope', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)
    emitter.on(event, listener, EventScope.GLOBAL)

    let listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([ listener ])

    emitter.clearAll(EventScope.LOCAL)

    listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([])

    listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([ listener ])

    emitter.clearAll(EventScope.GLOBAL)

    listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([])
  })

  it ('can clear all local by default', () => {
    const emitter = new ElixirEmitter()

    const event = 'some:event'
    const listener = (): void => {
      jest.fn()
    }

    emitter.on(event, listener, EventScope.LOCAL)
    emitter.on(event, listener, EventScope.GLOBAL)

    let listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([ listener ])

    emitter.clearAll()

    listeners = emitter.getListeners(event, EventScope.LOCAL)

    expect(listeners).toEqual([])

    listeners = emitter.getListeners(event, EventScope.GLOBAL)

    expect(listeners).toEqual([ listener ])
  })
})
