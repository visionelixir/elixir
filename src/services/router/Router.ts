import { Route, Middleware, RouterMethods, Router } from '../..'
import * as KoaRouter from 'koa-router'
import { ElixirRoute } from './Route'

export class ElixirRouter implements Router {
  protected routes: Array<Route>
  protected koaRouter: KoaRouter

  constructor() {
    this.routes = []
    this.koaRouter = new KoaRouter()
  }

  public find = (path: string, method: string): Route | undefined => {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    return this.getRoutes().find((route: Route) => {
      return route.getMethod() === method && route.getPath() === path
    })
  }

  public all = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.ALL, path, middleware)

    return this
  }

  public get = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.GET, path, middleware)

    return this
  }

  public post = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.POST, path, middleware)

    return this
  }

  public put = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.PUT, path, middleware)

    return this
  }

  public patch = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.PATCH, path, middleware)

    return this
  }

  public delete = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.DELETE, path, middleware)

    return this
  }

  public options = (path: string, middleware: Middleware[]): ElixirRouter => {
    this.add(RouterMethods.OPTIONS, path, middleware)

    return this
  }

  public some = (
    methods: RouterMethods[],
    path: string,
    middleware: Middleware[],
  ): ElixirRouter => {
    methods.map(method => this.add(method, path, middleware))

    return this
  }

  public add = (
    method: RouterMethods,
    path: string,
    middleware: Middleware[],
  ): ElixirRouter => {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    this.routes.push(new ElixirRoute(method, path, middleware))

    return this
  }

  public getRoutes = (): Route[] => {
    return this.routes
  }

  public getCore = (): KoaRouter => {
    return this.koaRouter
  }
}
