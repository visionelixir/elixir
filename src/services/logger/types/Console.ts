import * as chalk from 'chalk'
import { KeyValue } from '../../../vision/types'
import { SeverityColors, Severity } from '../types'

export class Console {
  public render(
    name: string,
    type: Severity,
    color: SeverityColors,
    timestamp: string,
    message: string,
    meta: KeyValue,
  ): void {
    const severityName: string = Severity[type]
    const stamp =
      chalk.hex(SeverityColors.STAMP)(`[${timestamp}][${name}]`) +
      chalk.hex(color)(`[${severityName}] `)

    const print: string[] = [message]

    const metaPrint: string = JSON.stringify(meta, null, 2).replace(
      /\\n/g,
      `\n`,
    )

    if (metaPrint.split(`\n`).length > 1) {
      metaPrint.split(`\n`).map((r: string) => print.push(r))
    } else {
      print.push(metaPrint)
    }

    print.forEach((text: string, index: number) => {
      let render = ''

      if (index === 0) {
        render = stamp + chalk.hex(color)(text)
      } else {
        const pad = ' '.repeat(`[${timestamp}][${name}]`.length)
        render = chalk.hex(SeverityColors.STAMP)(`${pad}${text}`)
      }

      // eslint-disable-next-line no-console
      console.log(render)
    })
  }
}
