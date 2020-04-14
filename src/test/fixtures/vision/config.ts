import * as path from 'path'
import { Environment, VisionConfig } from '../../..'

export const TEST_VISION_CONFIG: VisionConfig = {
  name: 'Test Vision',

  host: 'localhost',
  port: 3001,

  environment: Environment.DEVELOPMENT,

  // debug: true,

  // timezone: 'utc',

  // encryptionKey: 'abcd',

  baseDirectory: path.normalize(`${__dirname}`),

  services: {
    setupFile: 'Setup',
    eventFile: 'events',
    routeFile: 'routes',
    directory: 'services',
    require: [
      'core'
    ]
  },
  //
  // views: {
  //   serviceViewDirectory: 'views',
  //   themesDirectory: 'themes',
  //   themeFallback: [
  //     'mySite',
  //     'base'
  //   ],
  // },
  //
  // errorHandler: async () => {  },
  //
  // database: {
  //   connections: {
  //
  //     _default: {
  //       type: EDatabaseConnectionTypes.PG,
  //       host: 'localhost',
  //       database: 'cadence',
  //       user: 'postgres',
  //       password: 'postgres',
  //       port: 5433,
  //     }
  //
  //   }
  //
  // }
}
//
// export const appTestConfigNoDatabase: AppConfig = {
//   name: 'Test App',
//
//   host: 'localhost',
//   port: NumberUtil.getRandomInt(3001, 4000),
//
//   environment: Environment.DEVELOPMENT,
//
//   debug: true,
//
//   timezone: 'utc',
//
//   encryptionKey: 'abcd',
//
//   baseDir: path.normalize(`${__dirname}`),
//
//   services: {
//     eventFile: 'events',
//     routeFile: 'routes',
//     directory: 'services',
//     require: [
//       'core'
//     ]
//   },
//
//   views: {
//     serviceViewDirectory: 'views',
//     themesDirectory: 'themes',
//     themeFallback: [
//       'mySite',
//       'base'
//     ],
//   },
//
//   errorHandler: async () => {  },
// }
