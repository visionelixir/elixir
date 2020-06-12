import { KeyValue, LoggerFacade as Logger, Next, TaskMiddleware } from '../..'

export class TaskRunner {
  protected env: string
  protected middleware: TaskMiddleware[]
  protected context: KeyValue

  constructor() {
    this.middleware = []
    this.context = {}
  }

  public use(fn: (context: KeyValue, next: Next) => void): TaskRunner {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function!')
    }

    this.middleware.push(fn)
    return this
  }

  public async run(): Promise<void> {
    const fn = this.compose(this.middleware)
    const ctx = {}

    await fn(ctx).catch((error: Error) => {
      Logger.error(error)
    })
  }

  protected compose(
    middleware: TaskMiddleware[],
  ): (context: KeyValue) => Promise<void> {
    return (context: KeyValue): Promise<void> => {
      let index = -1

      function dispatch(i: number): Promise<void> {
        if (i <= index) {
          return Promise.reject(new Error('next() called multiple times'))
        }

        index = i

        const fn = middleware[i]

        if (!fn) {
          return Promise.resolve()
        }

        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      }

      return dispatch(0)
    }
  }
}
