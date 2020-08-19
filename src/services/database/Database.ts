import { Pg } from './Pg'
import { DEFAULT_CONNECTION, Database } from './types'

export class ElixirDatabase implements Database {
  protected connections: { [key: string]: Pg } = {}

  public add(name: string, instance: Pg): ElixirDatabase {
    this.connections[name] = instance

    return this
  }

  public get(name?: string): Pg {
    if (name) {
      return this.connections[name]
    }

    return this.connections[DEFAULT_CONNECTION]
  }

  public all(): { [key: string]: Pg } {
    return this.connections
  }
}
