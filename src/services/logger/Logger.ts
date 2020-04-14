import * as chalk from 'chalk'
import { ETypeColors, Logger, AssetLoader } from '../..'

export class ElixirLogger implements Logger {
  protected pad = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(...messages: any): ElixirLogger {
    this.log(ETypeColors.INFO, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(...messages: any): ElixirLogger {
    this.log(ETypeColors.WARN, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(...messages: any): ElixirLogger {
    this.log(ETypeColors.ERROR, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(...messages: any): ElixirLogger {
    this.log(ETypeColors.DEBUG, ...messages)

    return this
  }

  protected getTimeStamp(): string {
    const now = new Date()
    const timeString = now
      .toISOString()
      .split('.')[0]
      .replace('T', ' ')

    return timeString
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected log(color: string, ...messages: any[]): void {
    const visionConfig = AssetLoader.getVisionConfig()
    if (!visionConfig.debug) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const print: any = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages.map((message: any) => {
      let result

      if (typeof message === 'object') {
        result = JSON.stringify(message, null, 2)
      } else {
        result = message
      }

      result = result.replace(/\\n/g, `\n`)

      if (typeof result === 'string' && result.split(`\n`).length > 1) {
        result = result.split(`\n`)

        result.map((r: string) => print.push(r))
      } else {
        print.push(result)
      }
    })

    const stamp = chalk`{hex('${ETypeColors.STAMP}') [${this.getTimeStamp()}]} `

    print.map((message: string, index: number) => {
      const pad = index === 0 || !this.pad ? stamp : '                      '

      // eslint-disable-next-line no-console
      console.info(pad + chalk`{hex('${color}') ${message}}`)
    })
  }
}
