import { ElixirError } from '../ElixirError'

describe('Elixir Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new ElixirError()
    } catch (error) {
      expect(error).toBeInstanceOf(ElixirError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new ElixirError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new ElixirError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
