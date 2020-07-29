import { KeyValue } from '../../vision/types'
import { SystemVars } from './loaders/SystemVars'
import { CommandVars } from './loaders/CommandVars'
import { FileVars } from './loaders/FileVars'

export class Environment {
  public static hasFetched = false
  public static vars: KeyValue = {}
  public static loaders = [SystemVars, FileVars, CommandVars]

  public static get(variableName: string, cast: 'string'): string | null
  public static get(variableName: string, cast: 'number'): number | null
  public static get(variableName: string, cast: 'boolean'): boolean | null
  public static get(variableName: string): string | null
  public static get<T extends string | number | boolean | null>(
    variableName: string,
    cast?: T,
  ): T | null {
    if (!this.hasFetched) {
      this.fetch()
    }

    let value = this.vars[variableName]

    if (typeof value === 'undefined') {
      return null
    }

    switch (cast) {
      case 'boolean':
        if (value === 'true' || value === '1') {
          value = true
        } else if (value === 'false' || value === '0') {
          value = false
        } else {
          value = Boolean(value)
        }
        break
      case 'number':
        value = Number(value)
        break
      default:
        value = String(value)
    }

    return value
  }

  public static all(): KeyValue {
    if (!this.hasFetched) {
      this.fetch()
    }

    return this.vars
  }

  public static set(name: string, value: string): Environment {
    if (!this.hasFetched) {
      this.fetch()
    }

    this.vars[name] = value

    return this
  }

  public static fetch(): Environment {
    let vars = {}

    this.loaders.map((Loader) => {
      const result = Loader.load()

      if (result) {
        vars = {
          ...vars,
          ...result,
        }
      }
    })

    this.vars = vars

    this.hasFetched = true

    return this
  }
}
