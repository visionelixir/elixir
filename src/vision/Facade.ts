import { ContainerManager } from '../services/container/ContainerManager'

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

        if (property === 'isRegistered') {
          return !!this.containerInstance
        }

        return this.containerInstance[property] || undefined
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected setContainerInstance(): any {
    if (!this.containerInstance) {
      try {
        this.containerInstance = ContainerManager.get().resolve(
          this.containerName,
        )
      } catch (e) {
        this.containerInstance = null
      }
    }

    return this.containerInstance
  }
}
