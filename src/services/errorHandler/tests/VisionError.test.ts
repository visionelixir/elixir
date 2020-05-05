import { VisionError } from '../VisionError'

describe('Vision Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new VisionError()
    } catch (error) {
      expect(error).toBeInstanceOf(VisionError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new VisionError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new VisionError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
