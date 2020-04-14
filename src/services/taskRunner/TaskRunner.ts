import * as events from 'events'
import {
  KeyValue,
  LoggerFacade as Logger,
  TaskRunnerOptions,
  Next,
  TaskMiddleware,
} from '../..'

export class TaskRunner extends events.EventEmitter {
  protected env: string
  protected middleware: TaskMiddleware[]
  protected context: KeyValue

  constructor(options?: TaskRunnerOptions) {
    super()
    options = options || {}
    this.env = options.env || process.env.NODE_ENV || 'development'
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

  public run(): void {
    const fn = this.compose(this.middleware)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fn({}, async () => {}).catch((error: Error) => {
      Logger.error(error)
    })
  }

  protected compose(
    middleware: TaskMiddleware[],
  ): (context: KeyValue, next: Next) => Promise<void> {
    if (!Array.isArray(middleware))
      throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function')
        throw new TypeError('Middleware must be composed of functions!')
    }

    return function(context: KeyValue, next: Next): Promise<void> {
      // last called middleware #
      let index = -1

      function dispatch(i: number): Promise<void> {
        if (i <= index)
          return Promise.reject(new Error('next() called multiple times'))

        index = i

        let fn = middleware[i]
        const emptyMiddleware = async (
          _ctx: KeyValue,
          next: Next,
        ): Promise<void> => {
          await next()
        }

        if (i === middleware.length) fn = next || emptyMiddleware

        if (!fn) return Promise.resolve()

        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
        } catch (err) {
          return Promise.reject(err)
        }
      }

      return dispatch(0)
    }
  }
}
