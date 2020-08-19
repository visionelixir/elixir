import { ElixirRouter } from '../Router'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const ctx = {
  elixir: {
    services: () => Container
  }
} as any

describe('Router: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Router', expect.any(ElixirRouter))
  })
})
