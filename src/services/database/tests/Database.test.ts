import { ElixirDatabase } from '../Database'
import { DEFAULT_CONNECTION } from '../types'

describe('Elixir Database', () => {
  it ('should be able to be instantiated', () => {
    const db = new ElixirDatabase()

    expect(db).toBeInstanceOf(ElixirDatabase)
  })

  it ('should be able to add a connection', () => {
    const db = new ElixirDatabase()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }

    db.add(connectionDetails.name, connectionDetails.instance)

    expect(db['connections']).toHaveProperty(connectionDetails.name)
    expect(db['connections'][connectionDetails.name]).toBe(connectionDetails.instance)
  })

  it ('should be able to get a connection by name', () => {
    const db = new ElixirDatabase()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }

    db.add(connectionDetails.name, connectionDetails.instance)
    const connection = db.get(connectionDetails.name)

    expect(connection).toBe(connectionDetails.instance)
  })

  it ('should get the default connection if no name is supplied', () => {
    const db = new ElixirDatabase()
    const connectionDetails = {
      name: DEFAULT_CONNECTION,
      instance: {} as any
    }

    db.add(connectionDetails.name, connectionDetails.instance)
    const connection = db.get()

    expect(connection).toBe(connectionDetails.instance)
  })

  it ('should return all connections', () => {
    const db = new ElixirDatabase()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }
    const connectionDetails2 = {
      name: 'myConnection2',
      instance: {} as any
    }

    db
      .add(connectionDetails.name, connectionDetails.instance)
      .add(connectionDetails2.name, connectionDetails2.instance)

    const connections = db.all()

    expect(connections).toMatchObject({
      [connectionDetails.name]: connectionDetails.instance,
      [connectionDetails2.name]: connectionDetails2.instance,
    })
  })
})
