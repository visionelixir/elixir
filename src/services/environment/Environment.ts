import { KeyValue } from '../../vision/types'
import { SystemVars } from './loaders/SystemVars'
import { CommandVars } from './loaders/CommandVars'
import { FileVars } from './loaders/FileVars'

export class Environment {
  public static hasFetched = false
  public static vars: KeyValue = {}
  public static loaders = [SystemVars, FileVars, CommandVars]

  public static get(variableName: string): string | null {
    if (!this.hasFetched) {
      this.fetch()
    }

    return this.vars[variableName]
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

    this.loaders.map(Loader => {
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
