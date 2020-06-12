import { PerformanceError } from '../PerformanceError'

describe('Performance Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new PerformanceError()
    } catch (error) {
      expect(error).toBeInstanceOf(PerformanceError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new PerformanceError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new PerformanceError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
