import { KeyValue } from '../../vision/types'
import { SystemVars } from './loaders/SystemVars'
import { CommandVars } from './loaders/CommandVars'
import { FileVars } from './loaders/FileVars'

type CastType<T> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never

type CastName = 'string' | 'number' | 'boolean'

export class Environment {
  public static hasFetched = false
  public static vars: KeyValue = {}
  public static loaders = [SystemVars, FileVars, CommandVars]

  public static get<T extends CastName>(
    variableName: string,
    cast?: T,
  ): CastType<T> | string {
    if (!this.hasFetched) {
      this.fetch()
    }

    let value = this.vars[variableName]

    switch (cast) {
      case 'boolean':
        value = Boolean(value)
        break
      case 'number':
        value = Number(value)
        break
      case 'string':
        value = String(value)
    }

    return value as CastType<T>
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
