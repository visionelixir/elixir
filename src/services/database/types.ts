import { Pg } from './Pg'

export enum DatabaseConnectionTypes {
  PG = 'PG',
}

export interface Database {
  add(name: string, instance: Pg): Database
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
  ssl?: any
  application_name?: string
}

export const DEFAULT_CONNECTION = 'default'
