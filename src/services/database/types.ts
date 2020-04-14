import { Pg } from '../..'

export enum DatabaseConnectionTypes {
  PG = 'PG',
}

export interface DatabaseManager {
  add(name: string, instance: Pg): DatabaseManager
  get(name?: string): Pg
  all(): { [key: string]: Pg }
}

export interface DatabaseConfig {
  connections: {
    [key: string]: DatabaseConnectionConfig
  }
}

export interface DatabaseConnectionConfig {
  type: DatabaseConnectionTypes
  host: string
  database: string
  user: string
  password: string
  port: number
}

export const DEFAULT_CONNECTION = 'default'
