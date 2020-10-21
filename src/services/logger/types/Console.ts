import * as chalk from 'chalk'
import { TypeColors, Types } from '../types'

export const Console = (
  type: Types,
  color: string,
  timestamp: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...messages: any[]
): void => {
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

  const stamp = chalk`{hex('${TypeColors.STAMP}') [${timestamp}]} `

  print.map((message: string, index: number) => {
    const pad = index === 0 ? stamp : '                      '
    let consoleMethod: (message: string) => void

    // eslint-disable-next-line no-console
    if (typeof console[type] !== 'undefined') {
      // eslint-disable-next-line no-console
      consoleMethod = console[type]
    } else {
      // eslint-disable-next-line no-console
      consoleMethod = console.info
    }

    consoleMethod(pad + chalk`{hex('${color}') ${message}}`)
  })
}
