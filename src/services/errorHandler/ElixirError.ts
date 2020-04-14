import { PayloadError } from './PayloadError'

const type = 'ElixirError'

export class ElixirError extends PayloadError {
  constructor(
    message = 'An error occurred',
    payload: unknown = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
