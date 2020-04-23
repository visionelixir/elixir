import { KeyValue } from '../..'

export interface Collector {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(name: string, value: any): Collector
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(name: string): any
  all(): KeyValue
  clear(): Collector
}
