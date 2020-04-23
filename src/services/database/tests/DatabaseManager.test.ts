import { ElixirDatabaseManager } from '../DatabaseManager'
import { DEFAULT_CONNECTION } from '../types'

describe('Elixir Database Manager', () => {
  it ('should be able to be instantiated', () => {
    const dbManager = new ElixirDatabaseManager()

    expect(dbManager).toBeInstanceOf(ElixirDatabaseManager)
  })

  it ('should be able to add a connection', () => {
    const dbManager = new ElixirDatabaseManager()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }

    dbManager.add(connectionDetails.name, connectionDetails.instance)

    expect(dbManager['connections']).toHaveProperty(connectionDetails.name)
    expect(dbManager['connections'][connectionDetails.name]).toBe(connectionDetails.instance)
  })

  it ('should be able to get a connection by name', () => {
    const dbManager = new ElixirDatabaseManager()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }

    dbManager.add(connectionDetails.name, connectionDetails.instance)
    const connection = dbManager.get(connectionDetails.name)

    expect(connection).toBe(connectionDetails.instance)
  })

  it ('should get the default connection if no name is supplied', () => {
    const dbManager = new ElixirDatabaseManager()
    const connectionDetails = {
      name: DEFAULT_CONNECTION,
      instance: {} as any
    }

    dbManager.add(connectionDetails.name, connectionDetails.instance)
    const connection = dbManager.get()

    expect(connection).toBe(connectionDetails.instance)
  })

  it ('should return all connections', () => {
    const dbManager = new ElixirDatabaseManager()
    const connectionDetails = {
      name: 'myConnection',
      instance: {} as any
    }
    const connectionDetails2 = {
      name: 'myConnection2',
      instance: {} as any
    }

    dbManager
      .add(connectionDetails.name, connectionDetails.instance)
      .add(connectionDetails2.name, connectionDetails2.instance)

    const connections = dbManager.all()

    expect(connections).toMatchObject({
      [connectionDetails.name]: connectionDetails.instance,
      [connectionDetails2.name]: connectionDetails2.instance,
    })
  })
})
