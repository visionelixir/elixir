import { Pool } from 'pg'
import * as _ from 'lodash'
import { DatabaseConnectionConfig } from './types'
import { KeyValue } from '../../vision/types'
import { DatabaseError } from './DatabaseError'

export class Pg {
  protected pool: Pool
  protected config: DatabaseConnectionConfig
  protected name: string

  constructor(name: string, config?: DatabaseConnectionConfig) {
    this.name = name

    if (config) {
      this.config = config
      this.connect(config)
    }
  }

  public connect = (config: DatabaseConnectionConfig): Pg => {
    this.config = config

    this.pool = new Pool(config)

    this.pool.on('error', (error: Error) => {
      throw new DatabaseError(
        `Unexpected error on idle client: ${error.message}`,
      )
    })

    return this
  }

  public disconnect = async (): Promise<Pg> => {
    await this.pool.end()

    return this
  }

  public async query(
    query: string,
    params?: Array<string | number>,
  ): Promise<KeyValue[]> {
    const { stack } = new Error()
    const client = await this.pool.connect()

    try {
      const result = await client.query(query, params)

      const formatted = result.rows.map((row: KeyValue) => {
        const record: KeyValue = {}

        for (const i in row) {
          record[_.camelCase(i)] = row[i]
        }

        return record
      })
      /* @todo reimplement
      if (EventDispatcher.isRegistered) {
        await EventDispatcher.emit(
          ElixirEvents.APP_DATA,
          new ElixirEvent({
            collection: 'queries',
            payload: { query, params },
          }),
        )
      }*/

      return formatted
    } catch (error) {
      throw new DatabaseError(
        error.message,
        { query, params, stack },
        'QueryFailure',
      )
    } finally {
      client.release()
    }
  }

  public async queryOne(
    query: string,
    params?: Array<string | number>,
  ): Promise<KeyValue | null> {
    const result = await this.query(query, params)

    return result[0] || null
  }

  public getName = (): string => {
    return this.name
  }

  public getConfig = (): DatabaseConnectionConfig => {
    return this.config
  }
}
