import { KeyValue } from '../../vision/types'
import { Logger, LogType, SeverityColors, Severity } from './types'
import { Console } from './types/Console'
import { GCloud } from './types/GCloud'

export class ElixirLogger implements Logger {
  protected logType: LogType
  protected logger: GCloud | Console

  public constructor(config: KeyValue, logType: LogType = LogType.CONSOLE) {
    switch (logType) {
      case LogType.CONSOLE:
        this.logger = new Console()
        break
      case LogType.GCLOUD:
        this.logger = new GCloud(config)
        break
    }
  }

  public log(logName: string, message: string, meta: KeyValue): ElixirLogger {
    this.render(
      logName,
      Severity.DEFAULT,
      SeverityColors.LEVEL_0,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(logName: string, message: string, meta: KeyValue): ElixirLogger {
    this.render(
      logName,
      Severity.DEBUG,
      SeverityColors.LEVEL_100,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(logName: string, message: string, meta: KeyValue): ElixirLogger {
    this.render(logName, Severity.INFO, SeverityColors.LEVEL_200, message, meta)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public notice(
    logName: string,
    message: string,
    meta: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.NOTICE,
      SeverityColors.LEVEL_300,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warning(
    logName: string,
    message: string,
    meta: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.WARNING,
      SeverityColors.LEVEL_400,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(logName: string, message: string, meta: KeyValue): ElixirLogger {
    this.render(
      logName,
      Severity.ERROR,
      SeverityColors.LEVEL_500,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public critical(
    logName: string,
    message: string,
    meta: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.CRITICAL,
      SeverityColors.LEVEL_600,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public alert(logName: string, message: string, meta: KeyValue): ElixirLogger {
    this.render(
      logName,
      Severity.ALERT,
      SeverityColors.LEVEL_700,
      message,
      meta,
    )

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emergency(
    logName: string,
    message: string,
    meta: KeyValue,
  ): ElixirLogger {
    this.render(
      logName,
      Severity.EMERGENCY,
      SeverityColors.LEVEL_800,
      message,
      meta,
    )

    return this
  }

  protected getTimeStamp(): string {
    const now = new Date()
    const timeString = now.toISOString().split('.')[0].replace('T', ' ')

    return timeString
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected render(
    logName: string,
    severity: Severity,
    color: SeverityColors,
    message: string,
    meta: KeyValue,
  ): void {
    this.logger.render(
      logName,
      severity,
      color,
      this.getTimeStamp(),
      message,
      meta,
    )
  }
}
