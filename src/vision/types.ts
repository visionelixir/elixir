import * as koa from 'koa'

declare module 'koa' {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
    rawBody: string
  }
}

export class Core extends koa {}
export { Middleware, Next, Request, Response, Context } from 'koa'

export type AsyncVoid = Promise<void>

export enum AppEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum ElixirEvents {
  INIT_SERVICE_SETUP_PRE = 'Elixir:Init:Service.Setup.Pre',
  INIT_SERVICE_SETUP_POST = 'Elixir:Init:Service.Setup.Post',
  RESPONSE_PRE = 'Elixir:Response:Pre',
  RESPONSE_POST = 'Elixir:Response:Post',
  RESPONSE_ERROR = 'Elixir:Response:Error',
  APP_DATA = 'Elixir:Data',
  INIT_VARS = 'Elixir:Init:Vars',
}

export enum ElixirGlobalEvents {
  INIT_MIDDLEWARE = 'Elixir:Init:Middleware',
}

export enum VisionElixirEnvironment {
  VISION = 'vision',
  ELIXIR = 'elixir',
}

export interface KeyValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface ServicesConfig {
  eventFile: string
  routeFile: string
  registerFile: string
  bootFile: string
  directory: string
  require: Array<string>
}

export interface ElixirConf {
  baseDirectory: string
  configDirectory: string
  services: ServicesConfig
}

export interface VisionConfig {
  environment: AppEnvironment
  port: number | string
  name: string
  host: string
  debug: boolean
  timezone: string
  encryptionKey: string
  baseDirectory: string
  configDirectory: string
  services: ServicesConfig
}
