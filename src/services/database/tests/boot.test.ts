import { global } from '../boot'
import * as boot from '../boot'
import { DatabaseConnectionTypes } from '../types'

/**
 * Mocks
 */
const Loader = {
  loadConfig: jest.fn()
} as any

const vision = {
  getLoader: () => Loader
} as any

const DatabaseInstance = {
  add: jest.fn()
} as any

// @ts-ignore
boot['DatabaseInstance'] = DatabaseInstance

beforeEach(jest.clearAllMocks)

/**
 * Tests
 */
describe('Database: Boot', () => {
  it('boots global with no config found', () => {
    global(vision)

    expect(DatabaseInstance.add).not.toBeCalled()
  })

  it('boots global and sets up connections', () => {
    Loader.loadConfig.mockImplementationOnce(() => ({
      connections: {
        default: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
        another: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
      },
    }))

    global(vision)

    expect(DatabaseInstance.add).toBeCalledTimes(2)
  })

  it('errors if the database type is not supported', () => {
    Loader.loadConfig.mockImplementationOnce(() => ({
      connections: {
        default: {
          type: DatabaseConnectionTypes.PG,
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
        another: {
          type: 'unsupported',
          host: 'localhost',
          database: 'vision_elixir',
          user: 'postgres',
          password: 'postgres',
          port: 5432,
        },
      },
    }))

    expect(() => {
      global(vision)
    }).toThrow()
  })
})