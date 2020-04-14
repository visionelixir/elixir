import { Container } from './types'

export class ElixirContainerManager {
  protected containers: { [key: string]: Container } = {}

  public get(name = 'default'): Container {
    return this.containers[name]
  }

  public set(name: string, container: Container): ElixirContainerManager {
    this.containers[name] = container

    return this
  }
}

export const ContainerManager = new ElixirContainerManager()
