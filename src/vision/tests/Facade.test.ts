import { ElixirContainer } from '../../services/container/Container'
import { ElixirFacade } from '../Facade'

beforeEach(jest.clearAllMocks)

describe('Vision: Facade', () => {
  it ('proxies the object', () => {
    const obj = {
      hello: jest.fn(),
      goodbye: jest.fn(),
      myVar: 'hello'
    }

    const container = new ElixirContainer()
    container.singleton('something', obj)

    const facade = new ElixirFacade('something')

    facade.hello()
    facade.goodbye(...['a', 'b', 'c'])

    expect(facade.myVar).toBe('hello')
    expect(obj.hello).toBeCalledTimes(1)
    expect(obj.goodbye).toBeCalledTimes(1)
  })

  it ('returns undefined if the property doesnt exist', () => {
    const obj = {
      hello: jest.fn(),
      goodbye: jest.fn(),
      myVar: 'hello'
    }

    const container = new ElixirContainer()
    container.singleton('something', obj)

    const facade = new ElixirFacade('something')

    expect(facade.somethingThatsNotThere).toBeUndefined()
  })

  it ('returns if it is registered', () => {
    const obj = {
      hello: jest.fn(),
      goodbye: jest.fn(),
      myVar: 'hello'
    }

    const container = new ElixirContainer()
    container.singleton('something', obj)

    const registeredFacade = new ElixirFacade('something')
    const unregisteredFacade = new ElixirFacade('somethingElse')

    expect(registeredFacade.isRegistered).toBe(true)
    expect(unregisteredFacade.isRegistered).toBe(false)
  })
})
