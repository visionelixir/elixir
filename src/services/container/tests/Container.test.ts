import { ElixirContainer } from '../Container'

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
})
