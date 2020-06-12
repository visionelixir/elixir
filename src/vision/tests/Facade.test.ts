import { ElixirFacade, ElixirContainer } from '../..'

describe('Vision: Facade', () => {
  it ('proxies the object', () => {
    const obj = {
      hello: jest.fn(),
      goodbye: jest.fn(),
      myVar: 'hello'
    }

    const container = new ElixirContainer()
    container.singleton('something', obj)

    expect(true).toBeTruthy()

    const facade = new ElixirFacade('something')

    facade.hello()
    facade.goodbye(...['a', 'b', 'c'])

    expect(facade.myVar).toBe('hello')
    expect(obj.hello).toBeCalledTimes(1)
    expect(obj.goodbye).toBeCalledTimes(1)
  })
})
