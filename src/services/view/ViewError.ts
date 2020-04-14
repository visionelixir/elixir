import { ElixirError } from '../errorHandler/ElixirError'

const type = 'View Error'

export class ViewError extends ElixirError {
  constructor(
    message = 'A view error occurred',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
