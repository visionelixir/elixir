// tslint:disable:no-expression-statement

import { PayloadError } from './PayloadError'

describe('Payload Error', () => {
  it ('it should be able to be thrown', async () => {
    try {
      throw new PayloadError()
    } catch (error) {
      expect(error).toBeInstanceOf(PayloadError)
    }
  })

  it ('it should be able to have a custom message', async () => {
    const customMessage = 'Hello'

    try {
      throw new PayloadError(customMessage)
    } catch (error) {
      expect(error).toBeInstanceOf(PayloadError)
      expect(error.message).toBe(customMessage)
    }

    const error = new PayloadError().setMessage(customMessage)

    try {
      throw error
    } catch (error) {
      expect(error.message).toBe(customMessage)
    }
  })

  it ('should be able to have a payload', async () => {
    const payload = 'payload'

    try {
      throw new PayloadError('Uh oh', payload)
    } catch (error) {
      expect(error.getPayload()).toEqual(payload)
    }

    const error = new PayloadError().setPayload(payload)

    try {
      throw error
    } catch (error) {
      expect(error.getPayload()).toBe(payload)
    }
  })

  it ('should be able to have a custom name', async () => {
    const name = 'MyName'

    try {
      throw new PayloadError('Uh oh', null, name)
    } catch (error) {
      expect(error.getName()).toBe(name)
    }

    const error = new PayloadError().setName(name)

    try {
      throw error
    } catch (error) {
      expect(error.getName()).toBe(name)
    }
  })

  it ('should return the correct type', async () => {
    const error = new PayloadError()

    try {
      throw error
    } catch (error) {
      expect(error.getType()).toBe(error.type)
    }
  })
})
