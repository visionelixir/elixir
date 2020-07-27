const type = 'PayloadError'

export class PayloadError extends Error {
  public type = type
  public name = 'PayloadError'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public payload: any = null

  constructor(
    message = 'Something went wrong, try again later',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any = null,
    name: string = type,
  ) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.message = message
    this.name = name

    this.payload = payload
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getPayload(): any {
    return this.payload
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public setPayload(payload: any): PayloadError {
    this.payload = payload

    return this
  }

  public getName(): string {
    return this.name
  }

  public setName(name: string): PayloadError {
    this.name = name

    return this
  }

  public setMessage(message: string): PayloadError {
    this.message = message

    return this
  }

  public getType(): string {
    return this.type
  }
}
