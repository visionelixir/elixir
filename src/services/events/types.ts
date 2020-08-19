export interface Emitter {
  on: (event: string, callback: EventListener, scope?: EventScope) => Emitter
  off: (event: string, callback: EventListener, scope?: EventScope) => Emitter
  getListeners: (event: string, scope?: EventScope) => EventListener[]
  emit: (eventName: string, eventInstance: Event, scope?: EventScope) => Emitter
}

export enum EventScope {
  GLOBAL = 'global',
  LOCAL = 'local',
}

export interface Event {
  setName(name: string): Event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData(data: any): Event
  getName(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(): any
}

export interface EventListener {
  (event: Event): void
}
