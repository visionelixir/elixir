import { PerformanceMark } from '../PerformanceMark'
import { performance } from 'perf_hooks'
import { PerformanceError } from '../PerformanceError'

const performanceSpy = jest.spyOn(performance, 'now')

beforeEach(jest.clearAllMocks)

describe('Performance Mark', () => {
  it ('can instantiate with a name', async () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    expect(mark).toBeInstanceOf(PerformanceMark)
    expect(mark['name']).toEqual(name)
  })

  it ('can get the name', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    const result = mark.getName()

    expect(result).toEqual(name)
  })

  it ('can start', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    mark.start()

    expect(performanceSpy).toBeCalledTimes(1)
    expect(mark['running']).toBe(true)

    mark.stop()
  })

  it ('errors if starting a running mark', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    mark.start()

    expect(() => {
      mark.start()
    }).toThrowError(PerformanceError)
  })

  it ('can stop and return the duration', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    mark.start()
    const result = mark.stop()

    expect(performanceSpy).toBeCalledTimes(2)
    expect(mark['running']).toBe(false)
    expect(result).toBeGreaterThan(0)
  })

  it ('can return the running status', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    expect(mark.isRunning()).toBe(false)
    mark.start()
    expect(mark.isRunning()).toBe(true)
    mark.stop()
    expect(mark.isRunning()).toBe(false)
  })

  it ('can get the duration', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    mark.start()
    mark.stop()

    const duration = mark.getDuration()

    expect(duration).toBeGreaterThan(0)
  })

  it ('errors if getting the duration on a running mark', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)
    mark.start()

    expect(() => {
      mark.getDuration()
    }).toThrowError(PerformanceError)
  })

  it ('errors if stopping a mark that is not running', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    expect(() => {
      mark.stop()
    }).toThrowError(PerformanceError)
  })

  it ('can accumulate duration', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    mark.start()
    const firstDuration = mark.stop()
    mark.start()
    const secondDuration = mark.stop()
    mark.start()
    const finalDuration = mark.stop()

    expect(secondDuration).toBeGreaterThan(firstDuration)
    expect(finalDuration).toBeGreaterThan(secondDuration)
  })

  it ('can be reset', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    mark.start()
    mark.stop()
    const duration = mark.getDuration()
    mark.reset()
    const duration2 = mark.getDuration()

    expect(duration).not.toBe(0)
    expect(duration2).toBe(0)
  })

  it ('can be reset while running', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    mark.start()
    mark.stop()
    const duration = mark.getDuration()
    const count = mark.getCount()
    mark.start()
    mark.reset()
    const duration2 = mark.getDuration()
    const count2 = mark.getCount()

    expect(duration).not.toBe(0)
    expect(duration2).toBe(0)
    expect(count).not.toBe(0)
    expect(count2).toBe(0)
  })

  it ('keeps track of its count', () => {
    const name = 'test'
    const mark = new PerformanceMark(name)

    mark.start()
    mark.stop()

    mark.start()
    mark.stop()

    mark.start()
    mark.stop()

    expect(mark.getCount()).toEqual(3)
  })
})
