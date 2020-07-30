import { mocked } from 'ts-jest'
import { ElixirPerformance as Performance } from '../Performance'
import { PerformanceError } from '../PerformanceError'

jest.mock('../PerformanceMark', require('../mocks/PerformanceMark').PerformanceMarkMock)

describe('Performance', () => {
  it ('can instantiate', () => {
    const performance = new Performance()

    expect(performance).toBeInstanceOf(Performance)
  })

  it ('can start a measure', () => {
    const performance = new Performance()
    const name = 'test'

    performance.start(name)

    expect(performance['benchmarks']).toHaveProperty(name)
    expect(performance['benchmarks'][name]['start']).toHaveBeenCalledTimes(1)
  })

  it ('can stop a measure', () => {
    const performance = new Performance()
    const name = 'test'

    performance.start(name)
    performance.stop(name)

    expect(performance['benchmarks']).toHaveProperty(name)
    expect(performance['benchmarks'][name].stop).toHaveBeenCalledTimes(1)
  })

  it ('will error when stopping a measure that does not exist', () => {
    const performance = new Performance()

    expect(() => {
      performance.stop('something')
    }).toThrowError(PerformanceError)
  })

  it ('can get a measure', () => {
    const performance = new Performance()
    const name = 'test'
    const mock = {}

    performance['benchmarks'][name] = mock as any

    const result = performance.get(name)

    expect(result).toBe(mock)
  })

  it ('will error if getting a measure that does not exist', () => {
    const performance = new Performance()

    expect(() => {
      performance.get('does not exist')
    }).toThrowError(PerformanceError)
  })

  it ('can get all marks', () => {
    const performance = new Performance()
    const name = 'test'
    const mock = {}
    const name2 = 'test2'
    const mock2 = {}

    performance['benchmarks'][name] = mock as any
    performance['benchmarks'][name2] = mock2 as any

    const result = performance.all()
    expect(result).toMatchObject({
      [name]: mock,
      [name2]: mock2,
    })
  })

  it ('can get all marks as an array', () => {
    const performance = new Performance()
    const name = 'test'
    const mock = {}
    const name2 = 'test2'
    const mock2 = {}

    performance['benchmarks'][name] = mock as any
    performance['benchmarks'][name2] = mock2 as any

    const result = performance.allArray()
    expect(result).toEqual([
      mock, mock2
    ])
  })

  it ('can clear a mark', () => {
    const performance = new Performance()
    const name = 'test'
    const name2 = 'test2'

    performance.start(name)
    performance.start(name2)
    const mark = performance.get(name)
    performance.clear(name)

    expect(mark.stop).toBeCalledTimes(1)
    expect(performance['benchmarks']).not.toHaveProperty(name)
    expect(performance['benchmarks']).toHaveProperty(name2)
  })

  it ('should error if clearing a mark that does not exist', () => {
    const performance = new Performance()

    expect(() => {
      performance.clear('something')
    }).toThrowError(PerformanceError)
  })

  it ('can clear all marks', () => {
    const performance = new Performance()
    const name = 'test'
    const name2 = 'test2'

    performance.start(name)
    performance.start(name2)
    const mark = performance.get(name)
    const mark2 = performance.get(name2)
    performance.clearAll()

    expect(mark.stop).toBeCalledTimes(1)
    expect(mark2.stop).toBeCalledTimes(1)
    expect(performance['benchmarks']).not.toHaveProperty(name)
    expect(performance['benchmarks']).not.toHaveProperty(name2)
  })

  it ('can clear all marks even if one is stopped', () => {
    const performance = new Performance()
    const name = 'test'
    const name2 = 'test2'

    performance.start(name)
    performance.start(name2)
    performance.stop(name2)

    const mark = performance.get(name)
    const mark2 = performance.get(name2)

    const mark2Mock = mocked(mark2)
    mark2Mock.isRunning.mockImplementationOnce(() => false)

    performance.clearAll()

    expect(mark.stop).toBeCalledTimes(1)
    expect(mark2.stop).toBeCalledTimes(1)
    expect(performance['benchmarks']).not.toHaveProperty(name)
    expect(performance['benchmarks']).not.toHaveProperty(name2)
  })
})
