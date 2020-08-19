import { KeyValue } from '../../vision/types'
import { Class, ContainerService, ContainerTypes, Container } from './types'
import { ContainerError } from './ContainerError'

export class ElixirContainer implements Container {
  protected name: string
  protected services: { [key: string]: ContainerService } = {}

  constructor(name = 'default') {
    this.name = name

    this.singleton('Container', this)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public singleton(name: string, object: any, force = false): ElixirContainer {
    this.setService(name, ContainerTypes.SINGLETON, object, force)

    return this
  }

  public setService(
    name: string,
    type: ContainerTypes,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public resolve(service: string): any
  public resolve(...args: string[]): KeyValue
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public resolve(...args: string[]): KeyValue | any {
    const requested: KeyValue = {}

    args.map((serviceName) => {
      const resolved = this.getService(serviceName)

      if (resolved.type === ContainerTypes.SINGLETON) {
        requested[serviceName] = resolved.object
      } else {
        requested[serviceName] = new resolved.object()
      }
    })

    if (args.length === 1) {
      return requested[args[0]]
    }

    return requested
  }

  public getService(name: string): ContainerService {
    if (!this.services[name]) {
      throw new ContainerError(`Service with name ${name} not found`, { name })
    }

    return this.services[name]
  }

  public has(name: string): boolean {
    return !!this.services[name]
  }
}
