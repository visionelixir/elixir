import { PerformanceMarkCollection, Performance } from './types'
import { PerformanceMark } from './PerformanceMark'
import { PerformanceError } from './PerformanceError'

export class ElixirPerformance implements Performance {
  protected benchmarks: PerformanceMarkCollection = {}

  public start = (name: string): ElixirPerformance => {
    this.benchmarks[name] = new PerformanceMark(name).start()

    return this
  }

  public stop = (name: string): ElixirPerformance => {
    this.get(name).stop()

    return this
  }

  public get = (name: string): PerformanceMark => {
    if (!this.benchmarks[name]) {
      throw new PerformanceError(`Benchmark '${name}' not set`)
    }

    return this.benchmarks[name]
  }

  public all = (): PerformanceMarkCollection => {
    return this.benchmarks
  }

  public allArray = (): PerformanceMark[] => {
    const array: PerformanceMark[] = []

    for (const i in this.benchmarks) {
      const benchmark: PerformanceMark = this.benchmarks[i]

      array.push(benchmark)
    }

    return array
  }

  public clear = (name: string): ElixirPerformance => {
    this.get(name).stop()
    delete this.benchmarks[name]

    return this
  }

  public clearAll = (): ElixirPerformance => {
    this.allArray().map(mark => mark.stop())
    this.benchmarks = {}

    return this
  }
}
