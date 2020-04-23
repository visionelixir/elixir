import { DatabaseError } from '../DatabaseError'

describe('Database Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new DatabaseError()
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseError)
    }
  })

  it ('should return the correct type', async () => {
    const error = new DatabaseError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })

  it ('should return the correct name', async () => {
    const error = new DatabaseError()

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(error.name)
    }
  })
})
