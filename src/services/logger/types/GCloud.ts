import { Entry, Log, Logging } from '@google-cloud/logging'
import { google } from '@google-cloud/logging/build/protos/protos'
import { LogEntry } from '@google-cloud/logging/build/src/entry'
import { KeyValue } from '../../../vision/types'
import { Severity, SeverityColors } from '../types'
import IHttpRequest = google.logging.type.IHttpRequest

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
    // get the log to write to
    const log: Log = this.logging.log(name)

    // check for the presence of logger gcloud metadata
    const httpMeta: IHttpRequest = {
      cacheHit: false,
      latency: {
        nanos: meta?.performance?.[0]?.['App:Response'] * 1000000 || undefined,
      },
      status: meta?.request?.[0]?.status || undefined,
      requestMethod: meta?.request?.[0]?.method || undefined,
      requestUrl: meta?.request?.[0]?.url || undefined,
      requestSize: meta?.request?.[0]?.requestSize || undefined,
      responseSize: meta?.request?.[0]?.responseSize || undefined,
      cacheLookup: meta?.request?.[0]?.cacheLookup || undefined,
      cacheFillBytes: meta?.request?.[0]?.cacheFillBytes || undefined,
      cacheValidatedWithOriginServer:
        meta?.request?.[0]?.cacheValidatedWithOriginServer || undefined,
      protocol: meta?.request?.[0]?.protocol || undefined,
      referer: meta?.request?.[0]?.referrer || undefined,
      remoteIp: meta?.request?.[0]?.remoteIp || undefined,
      serverIp: meta?.request?.[0]?.serverIp || undefined,
      userAgent: meta?.request?.[0]?.userAgent || undefined,
    }

    // The metadata associated with the entry
    const metadata: LogEntry = {
      resource: this.config.logging.resource,
      severity: (type as unknown) as string,
      httpRequest: httpMeta,
    }

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
