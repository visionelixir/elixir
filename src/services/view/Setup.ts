import { AssetLoader } from '../../utils/AssetLoader'
import { ViewConfig } from './types'
import { Vision } from '../../vision/Vision'
import { VisionConfig, VisionElixirEnvironment } from '../../vision/types'
import * as path from 'path'
import * as nunjucks from 'nunjucks'
import { ElixirView } from './View'

export default class ViewSetup {
  run(vision: Vision): void {
    const viewConfig: ViewConfig = AssetLoader.loadConfig<ViewConfig>(
      VisionElixirEnvironment.VISION,
      'views',
    )

    const visionConfig = AssetLoader.getVisionConfig()

    this.registerContainer(vision)

    if (viewConfig) {
      const viewFallback = this.getViewFallback(visionConfig, viewConfig)
      this.configureNunjucks(viewFallback)
    }
  }

  public getViewFallback(
    config: VisionConfig,
    viewConfig: ViewConfig,
  ): string[] {
    const themePath = `${config.baseDirectory}/${viewConfig.themesDirectory}`
    const themeDirectory = path.normalize(themePath)

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

    return viewFallback
  }

  public configureNunjucks(viewFallback: string[]): void {
    nunjucks.configure(viewFallback, {
      autoescape: true,
    })
  }

  public registerContainer(vision: Vision): void {
    const container = vision.getContainer()
    container.singleton('View', new ElixirView())
  }
}
