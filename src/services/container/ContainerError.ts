import { ElixirError } from '../errorHandler/ElixirError'

const type = 'ContainerError'

export class ContainerError extends ElixirError {
  constructor(
    message = 'A container error occurred',
    payload: unknown = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
