import { TaskRunner } from './TaskRunner'
import { TaskMiddleware } from './types'

export abstract class Task {
  protected task: TaskRunner
  protected middleware: TaskMiddleware[]

  public constructor() {
    this.task = new TaskRunner()
    this.init()
  }

  protected abstract init(): void

  public setMiddleware = (middleware: TaskMiddleware[]): void => {
    this.middleware = middleware
  }

  public run = async (): Promise<void> => {
    this.middleware.map(middleware => this.task.use(middleware))
    await this.task.run().then()
  }
}
