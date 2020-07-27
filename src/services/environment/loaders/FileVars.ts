import { KeyValue } from '../../../vision/types'
import * as fs from 'fs'
import * as path from 'path'

export class FileVars {
  public static load(): KeyValue {
    const vars: KeyValue = {}
    const executedScript = process.argv[1]
    const pathParts = executedScript.split('/')
    pathParts.pop()
    const basePath = pathParts.join('/')

    const result = fs
      .readFileSync(path.resolve(basePath, '.environment'))
      .toString()

    result.split('\n').map((row) => {
      if (row) {
        const [name, value] = row.split('=')
        vars[name.trim()] = value.trim()
      }
    })

    return vars
  }
}
