import {
  AssetLoader,
  DatabaseConfig,
  DatabaseConnectionTypes,
  DatabaseError,
  ElixirDatabaseManager,
  DatabaseManagerFacade as DatabaseManager,
  Pg,
  Vision,
  VisionElixirEnvironment,
} from '../..'

export default class LoggerSetup {
  run(vision: Vision): void {
    const databaseConfig: DatabaseConfig = AssetLoader
      .loadConfig<DatabaseConfig>(
        VisionElixirEnvironment.VISION,
        'database',
      )

    this.registerContainer(vision)

    if (databaseConfig) {
      this.setupConnections(databaseConfig)
    }
  }

  public registerContainer(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('DatabaseManager', new ElixirDatabaseManager())
  }

  public setupConnections(config: DatabaseConfig): void {
    for (const i in config.connections) {
      const connection = config.connections[i]

      switch (connection.type) {
        case DatabaseConnectionTypes.PG:
          DatabaseManager.add(i, new Pg(i, connection))
          break
        default:
          throw new DatabaseError(`
          Cannot handle database connection of type ${connection.type}
          `)
      }
    }
  }
}
