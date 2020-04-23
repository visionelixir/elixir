import * as koa from 'koa'

export class Core extends koa {}
export { Middleware, Next, Context } from 'koa'

export type AsyncVoid = Promise<void>

export enum AppEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum ElixirEvents {
  INIT_SERVICE_SETUP_PRE = 'Elixir:Init:Service.Setup.Pre',
  INIT_SERVICE_SETUP_POST = 'Elixir:Init:Service.Setup.Post',
  INIT_MIDDLEWARE = 'Elixir:Init:Middleware',
  INIT_VARS = 'Elixir:Init:Vars',
  RESPONSE_PRE = 'Elixir:Response:Pre',
  RESPONSE_POST = 'Elixir:Response:Post',
  RESPONSE_ERROR = 'Elixir:Response:Error',
  APP_DATA = 'Elixir:Data',
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
  setupFile: string
  directory: string
  require: Array<string>
}

export interface ElixirConfig {
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
