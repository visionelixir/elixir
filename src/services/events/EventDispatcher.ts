import { Event } from './types'
import { EventCallback, Events, EventDispatcher } from './types'

export class ElixirEventDispatcher implements EventDispatcher {
  protected events: Events = {}
  public isRegistered = false

  public on(event: string, callback: EventCallback): ElixirEventDispatcher {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(callback)

    return this
  }

  public off(event: string, callback: EventCallback): ElixirEventDispatcher {
    if (!this.getCallbacks(event).length) {
      return this
    }

    const index = this.events[event].indexOf(callback)

    if (index > -1) {
      this.events[event].splice(index, 1)
    }

    if (!this.getCallbacks(event).length) {
      delete this.events[event]
    }

    return this
  }

  public getCallbacks(event: string): EventCallback[] {
    if (!this.events[event]) {
      return []
    }

    return this.events[event]
  }

  public async emit(eventName: string, eventInstance: Event): Promise<void> {
    await Promise.all(
      this.getCallbacks(eventName).map(async callback => {
        await callback(eventInstance)
      }),
    )
  }
}
