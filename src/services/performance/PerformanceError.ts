import { ElixirError } from '../errorHandler/ElixirError'

const type = 'PerformanceError'

export class PerformanceError extends ElixirError {
  constructor(
    message = 'A performance error occurred',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
