import { KeyValue } from '../..'

export interface Collector {
  add(name: string, value: any): Collector
  get(name: string): any
  all(): KeyValue
  clear(): Collector
}
