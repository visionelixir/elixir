import { Pg } from '../Pg'
import { DatabaseConnectionTypes } from '../types'
import { DatabaseError } from '../DatabaseError'

jest.mock('../../events/facades', require('../../events/mocks/facades').EventDispatcherFacadeMock)

afterEach(jest.clearAllMocks)

const mClient = {
  release: jest.fn(),
  query: jest.fn(async () => {
    return {
      rows: [
        { column_one: 'value one', column_two: 'value two' },
        { column_one: 'value three', column_two: 'value four' },
      ]
    }
  }),
}

const mPool = {
  connect: jest.fn(() => mClient),
  on: jest.fn((event, listener) => {
    return {
      event,
      listener
    }
  }),
  end: jest.fn(),
}

jest.mock('pg', () => {
  return { Pool: jest.fn(() => mPool) }
})

const config = {
  database: 'myDatabase',
  host: 'localhost',
  password: 'password',
  port: 5432,
  type: DatabaseConnectionTypes.PG,
  user: 'postgres'
}

describe('Pg', () => {
  it('should instantiate', () => {
    const pg = new Pg('pg')

    expect(pg).toBeInstanceOf(Pg)
  })

  it ('should connect', async () => {
    const pg = new Pg('pg')
    await pg.connect(config)

    expect(mPool.on).toBeCalledTimes(1)
    expect(pg['pool']).toBe(mPool)
  })

  it ('should query', async () => {
    const pg = new Pg('pg')
    await pg.connect(config)
    const result = await pg.query('select * from postgres', [ 1, 2, 3 ])

    expect(mPool.connect).toBeCalledTimes(1)
    expect(mClient.query).toBeCalledTimes(1)
    expect(mClient.release).toBeCalledTimes(1)
    expect(result).toMatchObject([
      { columnOne: 'value one', columnTwo: 'value two' },
      { columnOne: 'value three', columnTwo: 'value four' }
    ])
  })

  it ('should query one', async () => {
    const pg = new Pg('pg', config)
    const result = await pg.queryOne('select * from postgres', [ 1, 2, 3 ])

    expect(mPool.connect).toBeCalledTimes(1)
    expect(mClient.query).toBeCalledTimes(1)
    expect(mClient.release).toBeCalledTimes(1)
    expect(result).toMatchObject({ columnOne: 'value one', columnTwo: 'value two' })
  })

  it ('should return null if query one has no result', async () => {
    mClient.query.mockImplementationOnce(async () => {
      return {
        rows: []
      }
    })

    const pg = new Pg('pg', config)
    const result = await pg.queryOne('select * from postgres', [ 1, 2, 3 ])

    expect(mPool.connect).toBeCalledTimes(1)
    expect(mClient.query).toBeCalledTimes(1)
    expect(mClient.release).toBeCalledTimes(1)
    expect(result).toBeNull()
  })

  it ('can disconnect', async () => {
    const pg = new Pg('pg', config)
    await pg.disconnect()

    expect(mPool.end).toBeCalledTimes(1)
  })

  it ('returns the name', () => {
    const name = 'pg'
    const pg = new Pg(name)
    const returnedName = pg.getName()

    expect(returnedName).toBe(name)
  })

  it ('returns the config', () => {
    const pg = new Pg('name', config)
    const returnedConfig = pg.getConfig()

    expect(returnedConfig).toMatchObject(config)
  })

  it ('throws a database error if a query fails', async () => {
    mClient.query.mockImplementationOnce(async () => {
      throw new Error('something went wrong :(')
    })

    const pg = new Pg('name', config)

    await expect(pg.query('')).rejects.toThrow(DatabaseError)
  })

  it ('throws a database error if the pool errors', () => {
    let e: any = null
    let l: any = null

    mPool.on.mockImplementationOnce((event: any, listener: any): any => {
      e = event
      l = listener
    })

    new Pg('name', config)
    expect(e).toBe('error')
    expect(() => {
      l(new Error('something went wrong'))
    }).toThrow(DatabaseError)
  })
})