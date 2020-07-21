import { Task } from '../Task'
import { Next } from '../../../vision/types'

const called = jest.fn()

class MyTask extends Task {
  init() {
    this.setMiddleware([
      async (_ctx, next: Next) => {
        called('up')
        await next()
        called('down')
      },
      async (_ctx, next: Next) => {
        called('up 2')
        await next()
        called('down 2')
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

    expect(called).toBeCalledTimes(4)
    expect(called).nthCalledWith(1, 'up')
    expect(called).nthCalledWith(2, 'up 2')
    expect(called).nthCalledWith(3, 'down 2')
    expect(called).nthCalledWith(4, 'down')
  })
})
