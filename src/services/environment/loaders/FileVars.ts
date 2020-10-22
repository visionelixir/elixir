import * as yargsParser from 'yargs-parser'
import { KeyValue } from '../../../vision/types'
import * as fs from 'fs'
import * as path from 'path'

export class FileVars {
  public static load(): KeyValue {
    let toLoad: string
    const vars: KeyValue = {}

    if (process.env.BASE_DIRECTORY) {
      toLoad = process.env.BASE_DIRECTORY
    } else if (yargsParser(process.argv).baseDirectory) {
      toLoad = yargsParser(process.argv).baseDirectory
    } else {
      const executedScript = process.argv[1]
      const pathParts = executedScript.split('/')
      pathParts.pop()
      toLoad = pathParts.join('/')
    }

    // try load an environment scoped environment file
    let loaded: string | null = FileVars.loadFile(
      path.resolve(toLoad, `.${process.env.NODE_ENV}.environment`),
    )

    // if no environment scoped file was found then try load the generic one
    if (loaded === null) {
      loaded = FileVars.loadFile(path.resolve(toLoad, `.environment`))
    }

    if (!loaded) {
      return vars
    }

    loaded.split('\n').map((row) => {
      if (row) {
        const [name, value] = row.split('=')

        if (name && value) {
          vars[name.trim()] = value.trim()
        }
      }
    })

    return vars
  }

  public static loadFile(file: string): string | null {
    try {
      // eslint-disable-next-line no-console
      console.info('loading file: ' + file)
      return fs.readFileSync(file).toString()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      // it's ok if we dont find one
      return null
    }
  }
}
