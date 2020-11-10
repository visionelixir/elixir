import { AppEnvironment, KeyValue } from '../../vision/types'
import { CommandVars } from './loaders/CommandVars'
import { FileVars } from './loaders/FileVars'
import { SystemVars } from './loaders/SystemVars'
import { EnvironmentCasts } from './types'

export class Environment {
  public static hasFetched = false
  public static vars: KeyValue = {}
  public static loaders = [SystemVars, FileVars, CommandVars]

  public static get(
    variableName: string,
    defaultValue: string,
    cast: EnvironmentCasts.STRING,
  ): string
  public static get(
    variableName: string,
    defaultValue: number,
    cast: EnvironmentCasts.NUMBER,
  ): number
  public static get(
    variableName: string,
    defaultValue: boolean,
    cast: EnvironmentCasts.BOOLEAN,
  ): boolean
  public static get(
    variableName: string,
    defaultValue: KeyValue,
    cast: EnvironmentCasts.JSON,
  ): KeyValue
  public static get(variableName: string): string | null
  public static get(variableName: string, defaultValue: string): string
  public static get<T extends EnvironmentCasts>(
    variableName: string,
    defaultValue?: T,
    cast?: T,
  ): T | null {
    if (!this.hasFetched) {
      this.fetch()
    }

    let value = this.vars[variableName]

    if (typeof value === 'undefined') {
      if (defaultValue) {
        return defaultValue
      }

      return null
    }

    switch (cast) {
      case EnvironmentCasts.BOOLEAN:
        if (value === 'true' || value === '1') {
          value = true
        } else if (value === 'false' || value === '0') {
          value = false
        } else {
          value = Boolean(value)
        }
        break
      case EnvironmentCasts.NUMBER:
        value = Number(value)
        break
      case EnvironmentCasts.JSON:
        value = JSON.parse(value)
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

  public static which(): AppEnvironment {
    return this.get('ENVIRONMENT', AppEnvironment.DEVELOPMENT) as AppEnvironment
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
