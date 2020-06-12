import { NumberUtil } from '../NumberUtil'

describe('Utils: NumberUtil', () => {
  it ('can get a random integer', () => {
    const result = NumberUtil.getRandomInt(1, 5)
    expect(typeof result).toBe('number')
  })

  it ('can round numbers to 2dp by default', () => {
    const tests = [
      2.555,
      1.823,
      888.12222,
      888.55,
      888.555,
      888,
    ]

    const expected = [
      2.56,
      1.82,
      888.12,
      888.55,
      888.56,
      888
    ]

    const results = tests.map(test => {
      return NumberUtil.round(test)
    })

    expect(results).toEqual(expected)
  })

  it ('can round numbers to 0dp', () => {
    const tests = [
      2.555,
      1.823,
      888.12222,
      888.55,
      888.555,
      888,
    ]

    const expected = [
      3,
      2,
      888,
      889,
      889,
      888
    ]

    const results = tests.map(test => {
      return NumberUtil.round(test, 0)
    })

    expect(results).toEqual(expected)
  })

  it ('can round numbers to 1dp', () => {
    const tests = [
      2.555,
      1.823,
      888.12222,
      888.55,
      888.555,
      888,
    ]

    const expected = [
      2.6,
      1.8,
      888.1,
      888.6,
      888.6,
      888
    ]

    const results = tests.map(test => {
      return NumberUtil.round(test, 1)
    })

    expect(results).toEqual(expected)
  })
})