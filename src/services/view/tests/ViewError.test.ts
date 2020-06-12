import { ViewError } from '../ViewError'

describe('View Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new ViewError()
    } catch (error) {
      expect(error).toBeInstanceOf(ViewError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new ViewError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new ViewError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
