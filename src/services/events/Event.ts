import { Event } from './types'

export class ElixirEvent implements Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected data: any

  protected name = 'event'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data?: any, name?: string) {
    if (data) {
      this.setData(data)
    }

    if (name) {
      this.setName(name)
    }
  }

  public setName(name: string): ElixirEvent {
    this.name = name

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setData(data: any): ElixirEvent {
    this.data = data

    return this
  }

  public getName(): string {
    return this.name
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getData(): any {
    return this.data
  }
}
