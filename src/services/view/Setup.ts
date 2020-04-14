import {
  AssetLoader,
  ViewConfig,
  Vision,
  VisionConfig,
  VisionElixirEnvironment,
} from '../..'
import * as path from 'path'
import * as nunjucks from 'nunjucks'
import { ElixirView } from './View'

export default class LoggerSetup {
  run(vision: Vision): void {
    const viewConfig: ViewConfig = AssetLoader
      .loadConfig<ViewConfig>(
        VisionElixirEnvironment.VISION,
        'views',
      )

    const visionConfig = AssetLoader.getVisionConfig()

    this.registerContainer(vision)

    if (viewConfig) {
      this.setup(visionConfig, viewConfig)
    }
  }

  public setup(config: VisionConfig, viewConfig: ViewConfig): void {
    const themePath = `${config.baseDirectory}/${viewConfig.themesDirectory}`
    const themeDirectory = path.normalize(themePath)
    const testViewFolder = path.normalize(__dirname + '../../../test/views')

    let viewFallback = viewConfig.themeFallback.map((theme: string) => {
      return themeDirectory + '/' + theme
    })

    const serviceViewFolders = config.services.require.map(
      (service: string) => {
        const serviceViewFolder = `${config.baseDirectory}/${config.services.directory}/${service}/${viewConfig.serviceViewDirectory}`

        return serviceViewFolder
      },
    )

    viewFallback = viewFallback.concat(serviceViewFolders)
    viewFallback.push(testViewFolder)

    nunjucks.configure(viewFallback, {
      autoescape: true,
    })
  }

  public registerContainer(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('View', new ElixirView())
  }
}
