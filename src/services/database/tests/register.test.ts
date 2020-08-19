import { ElixirDatabase } from '../Database'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const ctx = {
  elixir: {
    services: () => Container
  }
} as any

describe('Database: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Database', expect.any(ElixirDatabase))
  })
})
