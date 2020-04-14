import { ElixirConfig } from '..'
import * as path from 'path'

export const ELIXIR_CONFIG: ElixirConfig = {
  baseDirectory: path.normalize(`${__dirname}/..`),
  configDirectory: 'config',
  services: {
    eventFile: 'events',
    setupFile: 'Setup',
    directory: 'services',
    routeFile: 'routes',
    require: [
      'container',
      'logger',
      'events',
      'app',
      'errorHandler',
      'database',
      'router',
      'view',
      'collector',
      'performance',
      'taskRunner',
    ],
  },
}
