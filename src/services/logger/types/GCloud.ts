import { Types } from '../types'

export const GCloud = (
  type: Types,
  _color: string,
  _timestamp: string,
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

  let consoleMethod: (message: string) => void

  // eslint-disable-next-line no-console
  if (typeof console[type] !== 'undefined') {
    // eslint-disable-next-line no-console
    consoleMethod = console[type]
  } else {
    // eslint-disable-next-line no-console
    consoleMethod = console.info
  }

  consoleMethod(print.join('\n'))
}
