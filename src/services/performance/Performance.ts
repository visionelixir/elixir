import { PerformanceMarkCollection, PerformanceMark, Performance } from '../..'

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

  public clear = (): ElixirPerformance => {
    this.benchmarks = {}

    return this
  }
}
