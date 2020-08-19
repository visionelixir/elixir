import * as path from 'path'
import { AppEnvironment, VisionConfig } from '../../..'

export const TEST_VISION_CONFIG: VisionConfig = {
  name: 'Test Vision',

  host: 'localhost',
  port: 3001,

  environment: AppEnvironment.DEVELOPMENT,

  debug: true,

  timezone: 'utc',

  encryptionKey: 'abcd',

  configDirectory: 'config',

  baseDirectory: path.normalize(`${__dirname}`),

  services: {
    bootFile: 'boot',
    registerFile: 'register',
    eventFile: 'events',
    routeFile: 'routes',
    directory: 'services',
    require: [
      'core'
    ]
  }
}
