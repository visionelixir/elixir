import { ContainerError } from '../ContainerError'

describe('Container Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new ContainerError()
    } catch (error) {
      expect(error).toBeInstanceOf(ContainerError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new ContainerError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new ContainerError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
