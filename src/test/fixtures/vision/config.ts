import * as path from 'path'
import { Environment, VisionConfig } from '../../..'

export const TEST_VISION_CONFIG: VisionConfig = {
  name: 'Test Vision',

  host: 'localhost',
  port: 3001,

  environment: Environment.DEVELOPMENT,

  debug: true,

  timezone: 'utc',

  encryptionKey: 'abcd',

  configDirectory: 'config',

  baseDirectory: path.normalize(`${__dirname}`),

  services: {
    setupFile: 'Setup',
    eventFile: 'events',
    routeFile: 'routes',
    directory: 'services',
    require: [
      'core'
    ]
  }
}
