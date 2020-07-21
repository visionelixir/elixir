import { KeyValue } from '../../../vision/types'

export class SystemVars {
  public static load(): KeyValue {
    const vars = process.env
    return vars
  }
}
