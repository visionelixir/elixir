import { ElixirEmitter } from '../Emitter'
import register from '../register'

const Container = {
  singleton: jest.fn()
}

const ctx = {
  elixir: {
    services: () => Container
  }
} as any

describe('Events: register', () => {
  it ('registers with the container', () => {
    register(ctx)

    expect(Container.singleton).toBeCalledTimes(1)
    expect(Container.singleton).toBeCalledWith('Emitter', expect.any(ElixirEmitter))
  })
})
