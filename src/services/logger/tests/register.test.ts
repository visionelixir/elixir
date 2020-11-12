import { ElixirLogger } from '../Logger'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const Loader = {
  singleton: jest.fn()
}

const ctx = {
  elixir: {
    services: () => ({ Container, Loader })
  }
} as any

describe('Logger: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Logger', expect.any(ElixirLogger))
  })
})
