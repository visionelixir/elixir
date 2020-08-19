import { ElixirLoader } from '../../utils/Loader'
import { VisionElixirEnvironment } from '../../vision/types'
import { Vision } from '../../vision/Vision'
import { DatabaseError } from './DatabaseError'
import { ElixirDatabase } from './Database'
import { Pg } from './Pg'
import {
  DatabaseConfig,
  DatabaseConnectionTypes,
  Database as IDatabase,
} from './types'

export const DatabaseInstance: IDatabase = new ElixirDatabase()

export const global = (vision: Vision): void => {
  const loader: ElixirLoader = vision.getLoader()
  const databaseConfig: DatabaseConfig = loader.loadConfig(
    VisionElixirEnvironment.VISION,
    'database',
  ) as DatabaseConfig

  if (databaseConfig) {
    setupConnections(DatabaseInstance, databaseConfig)
  }
}

const setupConnections = (
  Database: IDatabase,
  config: DatabaseConfig,
): void => {
  for (const i in config.connections) {
    const connection = config.connections[i]

    switch (connection.type) {
      case DatabaseConnectionTypes.PG:
        Database.add(i, new Pg(i, connection))
        break
      default:
        throw new DatabaseError(`
        Cannot handle database connection of type ${connection.type}
        `)
    }
  }
}
