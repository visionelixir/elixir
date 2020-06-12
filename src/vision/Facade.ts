import { ContainerManager } from '..'

export class ElixirFacade {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any

  protected containerName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected containerInstance: any | null

  public constructor(containerName: string) {
    this.containerName = containerName

    return new Proxy(this, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get: (_target: ElixirFacade, property: string): any => {
        this.setContainerInstance()

        return this.containerInstance[property]
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apply: (_target: any, _thisArg: any, argumentsList: any[]): any => {
        this.setContainerInstance()

        return this.containerInstance(...argumentsList)
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected setContainerInstance(): any {
    if (!this.containerInstance) {
      this.containerInstance = ContainerManager.get().resolve(
        this.containerName,
      )
    }

    return this.containerInstance
  }
}
