import { Entry, Log, Logging } from '@google-cloud/logging'
import { LogEntry } from '@google-cloud/logging/build/src/entry'
import { KeyValue } from '../../../vision/types'
import { Severity, SeverityColors } from '../types'

export class GCloud {
  protected config: KeyValue
  protected logging: Logging

  constructor(config: KeyValue) {
    this.config = config
    this.logging = new Logging({ projectId: this.config.projectId })
  }

  public render(
    name: string,
    type: Severity,
    _color: SeverityColors,
    _timestamp: string,
    message: string,
    meta: KeyValue,
  ): void {
    // Selects the log to write to

    // The metadata associated with the entry
    const metadata: LogEntry = {
      resource: this.config.logging.resource,
      severity: (type as unknown) as string,
      jsonPayload: meta,
    }

    const log: Log = this.logging.log(name)

    // Prepares a log entry
    const entry: Entry = log.entry(metadata, {
      message,
      meta,
    })

    log.write(entry).then(() => {
      // log written
    })
  }
}
