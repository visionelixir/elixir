import { ElixirView } from '../View'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const ctx = {
  elixir: {
    services: () => Container
  }
} as any

describe('View: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('View', expect.any(ElixirView))
  })
})
