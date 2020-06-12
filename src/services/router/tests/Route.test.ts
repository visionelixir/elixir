import { ElixirRoute } from '../Route'
import { RouterMethods } from '../types'

describe('Router: Route', () => {
  it ('can instantiate and set the method, path and middleware', () => {
    const route = new ElixirRoute(RouterMethods.ALL, '/', [])

    expect(route).toBeInstanceOf(ElixirRoute)
    expect(route['method']).toBe(RouterMethods.ALL)
    expect(route['path']).toBe('/')
    expect(route['middleware']).toEqual([])
  })

  it ('can get the method', () => {
    const route = new ElixirRoute(RouterMethods.ALL, '/', [])
    const method = route.getMethod()

    expect(method).toBe(RouterMethods.ALL)
  })

  it ('can get the path', () => {
    const route = new ElixirRoute(RouterMethods.ALL, '/', [])
    const path = route.getPath()

    expect(path).toBe('/')
  })

  it ('can get the middleware', () => {
    const route = new ElixirRoute(RouterMethods.ALL, '/', [ () => {}, () => {} ])
    const middleware = route.getMiddleware()

    expect(middleware).toBeInstanceOf(Array)
    expect(middleware).toHaveLength(2)
  })
})