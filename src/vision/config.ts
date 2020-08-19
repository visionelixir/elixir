import { ElixirConf } from '../vision/types'
import * as path from 'path'

export const ELIXIR_CONFIG: ElixirConf = {
  baseDirectory: path.normalize(`${__dirname}/..`),
  configDirectory: 'config',
  services: {
    eventFile: 'events',
    registerFile: 'register',
    bootFile: 'boot',
    directory: 'services',
    routeFile: 'routes',
    require: [
      'container',
      'loader',
      'logger',
      'config',
      'events',
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
