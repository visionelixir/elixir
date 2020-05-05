import { ElixirEventDispatcher } from '../EventDispatcher'

describe('Event Dispatcher', () => {
  it('can be instantiated', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    expect(eventDispatcher).toBeInstanceOf(ElixirEventDispatcher)
  })

  it ('can add an event listener', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback = async () => {}

    eventDispatcher.on(event, callback)

    expect(eventDispatcher['events']).toHaveProperty(event)
    expect(eventDispatcher['events'][event]).toHaveLength(1)
    expect(eventDispatcher['events'][event][0]).toBe(callback)
  })

  it ('can add multiple listeners on the same event', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback1 = async () => {}
    const callback2 = async () => {}

    eventDispatcher
      .on(event, callback1)
      .on(event, callback2)

    expect(eventDispatcher['events']).toHaveProperty(event)
    expect(eventDispatcher['events'][event]).toHaveLength(2)
    expect(eventDispatcher['events'][event][0]).toBe(callback1)
    expect(eventDispatcher['events'][event][1]).toBe(callback2)
  })

  it ('can remove an event listener', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback1 = async () => {}
    const callback2 = async () => {}

    eventDispatcher
      .on(event, callback1)
      .on(event, callback2)

    expect(eventDispatcher['events']).toHaveProperty(event)
    expect(eventDispatcher['events'][event]).toHaveLength(2)

    eventDispatcher
      .off(event, callback1)

    expect(eventDispatcher['events'][event]).toHaveLength(1)
    expect(eventDispatcher['events'][event][0]).toBe(callback2)
  })

  it ('does nothing if there is no match', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback1 = async () => {}
    const callback2 = async () => {}

    eventDispatcher
      .on(event, callback1)
      .on(event, callback2)

    expect(eventDispatcher['events']).toHaveProperty(event)
    expect(eventDispatcher['events'][event]).toHaveLength(2)

    eventDispatcher
      .off(event, async () => {})

    expect(eventDispatcher['events'][event]).toHaveLength(2)
    expect(eventDispatcher['events'][event][0]).toBe(callback1)
    expect(eventDispatcher['events'][event][1]).toBe(callback2)
  })

  it ('cleans up the events after removing all', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback1 = async () => {}
    const callback2 = async () => {}

    eventDispatcher
      .on(event, callback1)
      .on(event, callback2)

    expect(eventDispatcher['events']).toHaveProperty(event)
    expect(eventDispatcher['events'][event]).toHaveLength(2)

    eventDispatcher
      .off(event, callback1)
      .off(event, callback2)

    expect(eventDispatcher['events']).not.toHaveProperty(event)
  })

  it ('does nothing if calling off on an event that does not exist', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    expect(() => {
      eventDispatcher.off('some event', async () => {})
    }).not.toThrow()
  })

  it ('returns the callbacks for an event', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'
    const callback1 = async () => {}
    const callback2 = async () => {}

    eventDispatcher
      .on(event, callback1)
      .on(event, callback2)

    const result = eventDispatcher.getCallbacks(event)

    expect(result).toStrictEqual([
      callback1,
      callback2
    ])
  })

  it ('should not error if getting an event that is not registered', () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const event = 'some:event'

    const result = eventDispatcher.getCallbacks(event)

    expect(result).toEqual([])
  })

  it ('can emit an event', async () => {
    const eventDispatcher = new ElixirEventDispatcher()

    const eventName = 'some:event'
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const event = 'eventInstance' as any

    eventDispatcher
      .on(eventName, callback1)
      .on(eventName, callback2)

    await eventDispatcher.emit(eventName, event)

    expect(callback1).toBeCalledTimes(1)
    expect(callback2).toBeCalledTimes(1)
  })
})