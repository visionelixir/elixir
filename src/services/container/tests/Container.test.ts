import { ElixirContainer } from '../Container'
import { ContainerTypes } from '../types'
import { ContainerError } from '../ContainerError'

describe('Elixir Container', () => {
  it ('should instantiate', () => {
    const container = new ElixirContainer()

    expect(container).toBeInstanceOf(ElixirContainer)
  })

  it ('should get the name', () => {
    const container = new ElixirContainer('myContainer')
    const name = container.getName()

    expect(name).toEqual('myContainer')
  })

  it ('should have the name default by default', () => {
    const container = new ElixirContainer()
    const name = container.getName()

    expect(name).toEqual('default')
  })

  it ('can set a singleton service', () => {
    const container = new ElixirContainer()
    const myService = { a: 1, b: 2 }
    const myServiceName = 'myService'

    container.singleton(myServiceName, myService)

    expect(container['services']).toHaveProperty(myServiceName)
    expect(container['services'][myServiceName].object).toMatchObject(myService)
    expect(container['services'][myServiceName].name).toEqual(myServiceName)
    expect(container['services'][myServiceName].type).toEqual(ContainerTypes.SINGLETON)
  })

  it ('can set a transient service', () => {
    const container = new ElixirContainer()
    class MyService {}
    const myServiceName = 'myService'

    container.transient(myServiceName, MyService)

    expect(container['services']).toHaveProperty(myServiceName)
    expect(container['services'][myServiceName].object).toEqual(MyService)
    expect(container['services'][myServiceName].name).toBe(myServiceName)
    expect(container['services'][myServiceName].type).toBe(ContainerTypes.TRANSIENT)
  })

  it ('can resolve a singleton service', () => {
    const container = new ElixirContainer()
    const myService = { a: 1, b: 2 }
    const myServiceName = 'myService'

    container.singleton(myServiceName, myService)

    const result = container.resolve(myServiceName)
    const result2 = container.resolve(myServiceName)

    expect(result).toBe(myService)
    expect(result2).toBe(result)
  })

  it ('can resolve a transient service', () => {
    const container = new ElixirContainer()
    class MyService {
      sayHello: () => 'hello'
    }
    const myServiceName = 'myService'

    container.transient(myServiceName, MyService)

    const result = container.resolve(myServiceName)
    const result2 = container.resolve(myServiceName)

    expect(result).toBeInstanceOf(MyService)
    expect(result2).toBeInstanceOf(MyService)
    expect(result2).not.toBe(result)
  })

  it ('should error if the service does not exist', () => {
    const container = new ElixirContainer()

    expect(() => {
      container.resolve('something')
    }).toThrowError(ContainerError)
  })

  it ('should error if a service with the same name already exists', () => {
    const container = new ElixirContainer()
    const service = { a: 1, b: 2 }
    const serviceName = 'myService'

    container.singleton(serviceName, service)

    expect(() => {
      container.singleton(serviceName, service)
    }).toThrowError(ContainerError)
  })

  it ('should allow a service to be overridden', () => {
    const container = new ElixirContainer()
    const service = { a: 1, b: 2 }
    const service2 = { c: 3, d: 4 }
    const serviceName = 'myService'

    container.singleton(serviceName, service)
    const result = container.resolve(serviceName)

    expect(result).toBe(service)

    container.singleton(serviceName, service2, true)
    const result2 = container.resolve(serviceName)

    expect(result2).toBe(service2)
  })

  it ('should force false by default calling set service', () => {
    const container = new ElixirContainer()
    const service = { a: 1, b: 2 }
    const serviceName = 'myService'

    container.setService(serviceName, ContainerTypes.SINGLETON, service)

    expect(() => {
      container.setService(serviceName, ContainerTypes.SINGLETON, service)
    }).toThrowError(ContainerError)
  })

  it ('can return if something is registered or not', () => {
    const container = new ElixirContainer()
    const service = { a: 1, b: 2 }
    const serviceName = 'myService'

    container.setService(serviceName, ContainerTypes.SINGLETON, service)

    const existsResult = container.has(serviceName)
    const doesntExistResult = container.has('something')

    expect(existsResult).toBe(true)
    expect(doesntExistResult).toBe(false)
  })
})
