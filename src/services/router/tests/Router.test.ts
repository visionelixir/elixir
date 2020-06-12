import { ElixirRouter } from '../Router'
import { ElixirRoute } from '../Route'
import { RouterMethods } from '../types'
import * as KoaRouter from 'koa-router'

describe('Router: Router', () => {
  it ('can instantiate', () => {
    const router = new ElixirRouter()

    expect(router).toBeInstanceOf(ElixirRouter)
  })

  it ('can add a GET route', () => {
    const router = new ElixirRouter()

    router.get('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.GET)
  })

  it ('can add a POST route', () => {
    const router = new ElixirRouter()

    router.post('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.POST)
  })

  it ('can add a PUT route', () => {
    const router = new ElixirRouter()

    router.put('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.PUT)
  })

  it ('can add a PATCH route', () => {
    const router = new ElixirRouter()

    router.patch('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.PATCH)
  })

  it ('can add a DELETE route', () => {
    const router = new ElixirRouter()

    router.delete('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.DELETE)
  })

  it ('can add a OPTIONS route', () => {
    const router = new ElixirRouter()

    router.options('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.OPTIONS)
  })

  it ('can add a route for some methods', () => {
    const router = new ElixirRouter()

    router.some([ RouterMethods.GET, RouterMethods.POST ], '/', [])

    expect(router['routes']).toHaveLength(2)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.GET)
    expect(router['routes'][1].getMethod()).toEqual(RouterMethods.POST)
  })

  it ('can add a route for all methods', () => {
    const router = new ElixirRouter()

    router.all('/', [])

    expect(router['routes']).toHaveLength(1)
    expect(router['routes'][0]).toBeInstanceOf(ElixirRoute)
    expect(router['routes'][0].getMethod()).toEqual(RouterMethods.ALL)
  })

  it ('can find a route', () => {
    const router = new ElixirRouter()

    const middleware1 = [ () => {}, () => {} ]
    const middleware2 = [ () => {} ]

    router.get('/hello', middleware1)
    router.post('/hello', middleware2)

    const result = router.find('/hello', RouterMethods.GET)
    const result2 = router.find('/hello', RouterMethods.POST)

    expect(result).toBeInstanceOf(ElixirRoute)
    // @ts-ignore
    expect(result.getMethod()).toEqual(RouterMethods.GET)
    // @ts-ignore
    expect(result.getPath()).toEqual('/hello')

    expect(result2).toBeInstanceOf(ElixirRoute)
    // @ts-ignore
    expect(result2.getMethod()).toEqual(RouterMethods.POST)
    // @ts-ignore
    expect(result2.getPath()).toEqual('/hello')
  })

  it ('can return the koa router', () => {
    const router = new ElixirRouter()
    const core = router.getCore()

    expect(core).toBeInstanceOf(KoaRouter)
  })

  it ('adds a slash to the path if missing', () => {
    const router = new ElixirRouter()
    router.get('something', [])

    const route = router.find('something', RouterMethods.GET)

    // @ts-ignore
    expect(route.getPath()).toEqual('/something')
  })

  it ('can return all the routes', () => {
    const router = new ElixirRouter()
    router.get('something', [])
    router.post('something', [])

    const routes = router.getRoutes()

    expect(routes).toHaveLength(2)
    expect(routes[0]).toBeInstanceOf(ElixirRoute)
    expect(routes[1]).toBeInstanceOf(ElixirRoute)
  })
})