import { KeyValue } from '../../../vision/types'
import * as yargsParser from 'yargs-parser'

export class CommandVars {
  public static load(): KeyValue {
    const vars = yargsParser(process.argv)

    // remove the path script
    delete vars._

    return vars
  }
}
