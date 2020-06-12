import { TaskRunner } from '../TaskRunner'

describe('TaskRunner: TaskRunner', () => {
  it ('can instantiate', () => {
    const taskRunner = new TaskRunner()

    expect(taskRunner).toBeInstanceOf(TaskRunner)
  })

  it ('can add middleware', () => {
    const taskRunner = new TaskRunner()

    taskRunner.use(() => {})

    expect(taskRunner['middleware']).toHaveLength(1)
  })

  it ('errors when adding middleware that is not a function', () => {
    const taskRunner = new TaskRunner()

    expect(() => {
      taskRunner.use('will fail' as any)
    }).toThrowError(TypeError)
  })

  it ('can run', async () => {
    let context: any = null
    const results: any[] = []
    
    const taskRunner = new TaskRunner()

    const middleware1 = async (ctx: any, next: any) => {
      context = ctx
      ctx.test = 'hello'
      results.push(1)

      await next()

      results.push(4)
    }

    const middleware2 = async (ctx: any, next: any) => {
      results.push(2)

      expect(ctx.test).toEqual('hello')

      ctx.test2 = 'hello again'

      await next()

      results.push(3)
    }

    taskRunner.use(middleware1)
    taskRunner.use(middleware2)

    await taskRunner.run()

    expect(context).toMatchObject({
      test: 'hello',
      test2: 'hello again'
    })

    expect(results).toEqual([1, 2, 3, 4])

    expect.assertions(3)
  })

  it ('errors if the middleware is not a function', async () => {
    const taskRunner = new TaskRunner()

    expect(() => {
      taskRunner.use('hello' as any)
    }).toThrow(TypeError)
  })

  it ('still runs if there is no middleware', async() => {
    const taskRunner = new TaskRunner()

    await expect(taskRunner.run()).resolves.toBeUndefined()
  })

  it ('still runs if next is not called', async() => {
    const taskRunner = new TaskRunner()
    const results = []

    const middleware1 = async (_ctx: any, next: any) => {
      results.push(1)
      await next()
      results.push(4)
    }

    const middleware2 = async () => {
      results.push(2)
      results.push(3)
    }

    taskRunner.use(middleware1)
    taskRunner.use(middleware2)

    await expect(taskRunner.run()).resolves.toBeUndefined()
  })

  it ('errors if next is called more than once', async () => {
    const taskRunner = new TaskRunner()

    taskRunner.use(async (_ctx, next) => {
      await next()
      await next()
    })

    await expect(taskRunner.run()).rejects.toThrow(Error)
  })

  it ('rejects if the middleware errors', async () => {
    const taskRunner = new TaskRunner()

    taskRunner.use(async () => {
      throw new Error('error!')
    })

    await expect(taskRunner.run()).rejects.toThrow(Error)
  })
})
