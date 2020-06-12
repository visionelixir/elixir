import { PerformanceMark } from './PerformanceMark'

export interface PerformanceMarkCollection {
  [id: string]: PerformanceMark
}

export interface Performance {
  start(name: string): Performance
  stop(name: string): Performance
  get(name: string): PerformanceMark
  all(): PerformanceMarkCollection
  allArray(): PerformanceMark[]
  clear(name?: string): Performance
  clearAll(): Performance
}
