import * as yargsParser from 'yargs-parser'
import { KeyValue } from '../../../vision/types'
import * as fs from 'fs'
import * as path from 'path'

export class FileVars {
  public static load(): KeyValue {
    let toLoad: string
    const vars: KeyValue = {}

    if (process.env.baseDirectory) {
      toLoad = process.env.baseDirectory
    } else if (yargsParser(process.argv).baseDirectory) {
      toLoad = yargsParser(process.argv).baseDirectory
    } else {
      const executedScript = process.argv[1]
      const pathParts = executedScript.split('/')
      pathParts.pop()
      toLoad = pathParts.join('/')
    }

    let loaded: string

    try {
      loaded = fs.readFileSync(path.resolve(toLoad, '.environment')).toString()
    } catch (e) {
      // it's ok if we dont find one
      return {}
    }

    loaded.split('\n').map((row) => {
      if (row) {
        const [name, value] = row.split('=')
        vars[name.trim()] = value.trim()
      }
    })

    return vars
  }
}
