import { KeyValue } from '../../vision/types'

export interface Config {
  get(name: string, service?: string): KeyValue
}
