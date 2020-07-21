import { Middleware } from '../../vision/types'
import * as KoaRouter from 'koa-router'

export enum RouterMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  OPTIONS = 'options',
  ALL = 'all',
}

export interface Route {
  getMethod(): string
  getPath(): string
  getMiddleware(): Middleware[]
}

export interface Router {
  find(path: string, method: RouterMethods): Route | undefined
  all(path: string, middleware: Middleware[]): Router
  get(path: string, middleware: Middleware[]): Router
  post(path: string, middleware: Middleware[]): Router
  put(path: string, middleware: Middleware[]): Router
  patch(path: string, middleware: Middleware[]): Router
  delete(path: string, middleware: Middleware[]): Router
  options(path: string, middleware: Middleware[]): Router
  some(methods: RouterMethods[], path: string, middleware: Middleware[]): Router
  add(method: RouterMethods, path: string, middleware: Middleware[]): Router
  getRoutes(): Route[]
  getCore(): KoaRouter
}
