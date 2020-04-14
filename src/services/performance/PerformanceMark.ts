import { performance } from 'perf_hooks'
import { PerformanceError } from './PerformanceError'

export class PerformanceMark {
  protected name: string
  protected running: boolean
  protected startValue: number
  protected endValue: number
  protected duration: number

  constructor(name: string) {
    this.name = name
  }

  public getName(): string {
    return this.name
  }

  public isRunning(): boolean {
    return this.running
  }

  public start(): PerformanceMark {
    this.running = true
    this.startValue = performance.now()

    return this
  }

  public stop(): number {
    this.running = false
    this.endValue = performance.now()

    this.duration = this.endValue - this.startValue

    return this.getDuration()
  }

  public getDuration(): number {
    if (this.duration === undefined) {
      throw new PerformanceError('Measurement still running')
    }

    return this.duration
  }
}
