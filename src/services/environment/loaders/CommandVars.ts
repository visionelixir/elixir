import { KeyValue } from '../../../vision/types'
import * as yargsParser from 'yargs-parser'

export class CommandVars {
  public static load(): KeyValue {
    const vars = yargsParser(process.argv)
    return vars
  }
}
