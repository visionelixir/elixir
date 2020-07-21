export const PerformanceMarkMock = () => ({
  PerformanceMark: class {
    name: string

    constructor(name: string) {
      this.name = name
    }

    public start = jest.fn().mockImplementation(() => this)
    public stop = jest.fn().mockImplementation(() => this)
  }
})
