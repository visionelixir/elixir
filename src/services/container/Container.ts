import { Class, ContainerService, ContainerTypes, Container } from './types'
import { ContainerManager } from './ContainerManager'
import { ContainerError } from './ContainerError'

export class ElixirContainer implements Container {
  protected name: string
  protected services: { [key: string]: ContainerService } = {}

  constructor(name = 'default') {
    this.name = name
    ContainerManager.set(name, this)
  }

  public getName(): string {
    return this.name
  }

  public transient(
    name: string,
    object: Class,
    force = false,
  ): ElixirContainer {
    this.setService(name, ContainerTypes.TRANSIENT, object, force)

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public singleton(name: string, object: any, force = false): ElixirContainer {
    this.setService(name, ContainerTypes.SINGLETON, object, force)

    return this
  }

  public setService(
    name: string,
    type: ContainerTypes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any,
    force = false,
  ): ElixirContainer {
    if (this.services[name] && !force) {
      throw new ContainerError(`Service with name ${name} already registered`, {
        name,
      })
    }

    this.services[name] = {
      name,
      object,
      type,
    }

    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public resolve(name: string): any {
    const service = this.getService(name)

    if (service.type === ContainerTypes.SINGLETON) {
      return service.object
    } else {
      return new service.object()
    }
  }

  public getService(name: string): ContainerService {
    if (!this.services[name]) {
      throw new ContainerError(`Service with name ${name} not found`, { name })
    }

    return this.services[name]
  }
}
