export enum TypeColors {
  INFO = '#3598db',
  WARN = '#f39c11',
  ERROR = '#c1392b',
  DEBUG = '#999999',
  STAMP = '#666666',
}

export enum Types {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...messages: any[]): Logger
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...messages: any[]): Logger
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...messages: any[]): Logger
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...messages: any[]): Logger
}

export enum LogType {
  CONSOLE = 'console',
  GCLOUD = 'gcloud',
}
