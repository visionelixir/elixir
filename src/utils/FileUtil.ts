/*
import * as ncp from 'ncp'
import * as fs from 'fs'

const fsPromise = fs.promises

export class FileUtil {
  public static copyDirectory(
    source: string,
    destination: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ncp(source, destination, error => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  public static async writeFile(
    file: string,
    contents: string | null,
  ): Promise<void> {
    await fsPromise.writeFile(file, contents)
  }
}
*/
