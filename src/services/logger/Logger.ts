import { Logger, LogType, TypeColors, Types } from './types'
import { Console } from './types/Console'
import { GCloud } from './types/GCloud'

export class ElixirLogger implements Logger {
  protected logType: LogType

  public constructor(logType: LogType = LogType.CONSOLE) {
    this.logType = logType
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(...messages: any[]): ElixirLogger {
    this.log(Types.INFO, TypeColors.INFO, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn(...messages: any[]): ElixirLogger {
    this.log(Types.WARN, TypeColors.WARN, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(...messages: any[]): ElixirLogger {
    this.log(Types.ERROR, TypeColors.ERROR, ...messages)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(...messages: any[]): ElixirLogger {
    this.log(Types.DEBUG, TypeColors.DEBUG, ...messages)

    return this
  }

  protected getTimeStamp(): string {
    const now = new Date()
    const timeString = now.toISOString().split('.')[0].replace('T', ' ')

    return timeString
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected log(type: Types, color: TypeColors, ...messages: any[]): void {
    switch (this.logType) {
      case LogType.CONSOLE:
        Console(type, color, this.getTimeStamp(), ...messages)
        break
      case LogType.GCLOUD:
        GCloud(type, color, this.getTimeStamp(), ...messages)
    }
  }
}
