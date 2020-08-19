import { ElixirConfig } from '../Config'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const Loader = {} as any

const ctx = {
  elixir: {
    services: () => ({
      Container,
      Loader
    })
  }
} as any

describe('Config: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Config', expect.any(ElixirConfig))
  })
})
