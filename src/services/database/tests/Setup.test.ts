import DatabaseSetup from '../Setup'
import { DatabaseConnectionTypes } from '../types'
import { AssetLoader } from '../../../utils/AssetLoader'
import { DatabaseError } from '../DatabaseError'
import { DatabaseManagerFacade } from '../facades'

jest.mock('../../../vision/Vision', require('../../../vision/mocks/Vision').VisionMock)
jest.mock('../../database/facades', require('../../database/mocks/facades').DatabaseManagerFacadeMock)
jest.mock('../../../utils/AssetLoader', require('../../../utils/mocks/AssetLoader').AssetLoaderMock)
jest.mock('../Pg', require('../mocks/Pg').PgMock)

describe('Collector: Setup', () => {
  it ('should instantiate', async () => {
    const setup = new DatabaseSetup()

    expect(setup).toBeInstanceOf(DatabaseSetup)
  })

  it ('should run', () => {
    const singletonMock = jest.fn()

    jest.spyOn(AssetLoader, 'loadConfig').mockImplementationOnce(() => ({
      connections: {
        default: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
      }
    }))

    const setup = new DatabaseSetup()

    setup.setupConnections = jest.fn()
    setup.registerContainer = jest.fn()

    setup.run({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(setup.setupConnections).toBeCalledTimes(1)
    expect(setup.registerContainer).toBeCalledTimes(1)
  })

  it ('should not run connection setup if none exist', () => {
    const singletonMock = jest.fn()

    jest.spyOn(AssetLoader, 'loadConfig').mockImplementationOnce(() => null)

    const setup = new DatabaseSetup()

    setup.setupConnections = jest.fn()
    setup.registerContainer = jest.fn()

    setup.run({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(setup.setupConnections).not.toBeCalled()
    expect(setup.registerContainer).toBeCalledTimes(1)
  })

  it ('should register in the container', () => {
    const setup = new DatabaseSetup()
    const singletonMock = jest.fn()

    setup.registerContainer({
      getContainer: () => ({
        singleton: singletonMock
      })
    } as any)

    expect(singletonMock).toBeCalledTimes(1)
    expect(singletonMock).toBeCalledWith('DatabaseManager', {connections: {}})
  })

  it ('should setup connections', () => {
    const setup = new DatabaseSetup()
    const config = {
      connections: {
        default: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
        second: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432
        }
      }
    }

    setup.setupConnections(config)

    expect(DatabaseManagerFacade.add).toBeCalledTimes(2)
    expect(DatabaseManagerFacade.add).toBeCalledWith('default', {})
    expect(DatabaseManagerFacade.add).toBeCalledWith('second', {})
  })

  it ('should throw an error if the database type cannot be handled', () => {
    const setup = new DatabaseSetup()
    const config = {
      connections: {
        default: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
        fail: {
          type: 'mysql',
          host: 'localhost',
          database: 'vision_elixir',
          user: 'mysql',
          password: 'mysql',
          port: 1234
        }
      }
    }

    expect(() => {
      setup.setupConnections(config as any)
    }).toThrowError(DatabaseError)
  })
})
