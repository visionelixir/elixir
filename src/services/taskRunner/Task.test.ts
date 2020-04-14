import { Task } from './Task'
import { Next } from '../../..'

const called = jest.fn()

class MyTask extends Task {
  init() {
    this.setMiddleware([
      async (_ctx, next: Next) => {
        called('up')
        await next()
        called('down')
      }
    ])
  }
}

beforeEach(jest.clearAllMocks)

describe('Task', () => {
  it ('should instantiate', async () => {
    const myTask = new MyTask()

    expect(myTask).toBeInstanceOf(Task)
  })

  it ('should run', async () => {
    const myTask = new MyTask()
    await myTask.run()

    expect(called).toBeCalledTimes(2)
    expect(called).nthCalledWith(1, 'up')
    expect(called).nthCalledWith(2, 'down')
  })
})
