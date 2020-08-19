import { EventEmitter } from 'events'
import { Emitter, Event, EventListener, EventScope } from './types'

let globalEmitter: EventEmitter

export class ElixirEmitter implements Emitter {
  public isRegistered = false

  protected localEmitter: EventEmitter

  constructor() {
    this.localEmitter = new EventEmitter()

    if (typeof globalEmitter === 'undefined') {
      globalEmitter = new EventEmitter()
    }
  }

  public getEmitter(scope: EventScope = EventScope.LOCAL): EventEmitter {
    if (scope === EventScope.GLOBAL) {
      return globalEmitter
    }

    return this.localEmitter
  }

  public on(
    event: string,
    callback: EventListener,
    scope: EventScope = EventScope.LOCAL,
  ): ElixirEmitter {
    const emitter = this.getEmitter(scope)

    emitter.addListener(event, callback)

    return this
  }

  public off(
    event: string,
    callback: EventListener,
    scope: EventScope = EventScope.LOCAL,
  ): ElixirEmitter {
    const emitter = this.getEmitter(scope)

    emitter.removeListener(event, callback)

    return this
  }

  public getListeners(
    event: string,
    scope: EventScope = EventScope.LOCAL,
  ): EventListener[] {
    const emitter = this.getEmitter(scope)

    return emitter.listeners(event) as EventListener[]
  }

  public emit(
    eventName: string,
    eventInstance: Event,
    scope: EventScope = EventScope.LOCAL,
  ): ElixirEmitter {
    const emitter = this.getEmitter(scope)

    emitter.emit(eventName, eventInstance)

    return this
  }

  public getNames(
    scope: EventScope = EventScope.LOCAL,
  ): Array<string | symbol> {
    const emitter = this.getEmitter(scope)

    return emitter.eventNames()
  }

  public clear(
    eventName: string,
    scope: EventScope = EventScope.LOCAL,
  ): ElixirEmitter {
    const emitter = this.getEmitter(scope)

    emitter.removeAllListeners(eventName)

    return this
  }

  public clearAll(scope: EventScope = EventScope.LOCAL): ElixirEmitter {
    const emitter = this.getEmitter(scope)

    emitter.removeAllListeners()

    return this
  }
}
