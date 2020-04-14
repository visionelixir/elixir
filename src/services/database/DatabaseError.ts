import { ElixirError } from '../errorHandler/ElixirError'

const type = 'DatabaseError'

export class DatabaseError extends ElixirError {
  constructor(
    message = 'A database error occurred',
    payload: unknown = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
