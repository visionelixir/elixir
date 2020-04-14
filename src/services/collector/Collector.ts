import { KeyValue, Collector } from '../..'

export class ElixirCollector implements Collector {
  protected collections: KeyValue = {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public add = (name: string, value: any): ElixirCollector => {
    if (!this.collections[name]) {
      this.collections[name] = []
    }

    this.collections[name].push(value)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get = (name: string): any => {
    return this.collections[name]
  }

  public all = (): KeyValue => {
    return this.collections
  }

  public clear = (name?: string): ElixirCollector => {
    if (name) {
      delete this.collections[name]
    } else {
      this.collections = {}
    }

    return this
  }
}
