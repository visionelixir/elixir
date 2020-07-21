export interface EventDispatcher {
  on: (event: string, callback: EventCallback) => EventDispatcher
  off: (event: string, callback: EventCallback) => EventDispatcher
  getCallbacks: (event: string) => EventCallback[]
  emit: (eventName: string, eventInstance: Event) => Promise<void>
  isRegistered: boolean
}

export interface Event {
  setName(name: string): Event
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData(data: any): Event
  getName(): string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData(): any
}

export interface Events {
  [key: string]: Array<EventCallback>
}

export interface EventCallback {
  (event: Event): Promise<void>
}
