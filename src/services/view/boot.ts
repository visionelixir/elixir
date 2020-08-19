import * as nunjucks from 'nunjucks'
import * as path from 'path'
import { ElixirLoader } from '../../utils/Loader'
import {
  Context,
  VisionConfig,
  VisionElixirEnvironment,
} from '../../vision/types'
import { ViewConfig } from './types'

export default (ctx: Context): void => {
  const Loader: ElixirLoader = ctx.elixir.services('Loader')

  const viewConfig: ViewConfig = Loader.loadConfig<ViewConfig>(
    VisionElixirEnvironment.VISION,
    'views',
  )

  const visionConfig = Loader.getVisionConfig()

  if (viewConfig) {
    const viewFallback = getViewFallback(visionConfig, viewConfig)
    configureNunjucks(viewFallback)
  }
}

const getViewFallback = (
  config: VisionConfig,
  viewConfig: ViewConfig,
): string[] => {
  const themePath = `${config.baseDirectory}/${viewConfig.themesDirectory}`
  const themeDirectory = path.normalize(themePath)

  let viewFallback = viewConfig.themeFallback.map((theme: string) => {
    return themeDirectory + '/' + theme
  })

  const serviceViewFolders = config.services.require.map((service: string) => {
    const serviceViewFolder = `${config.baseDirectory}/${config.services.directory}/${service}/${viewConfig.serviceViewDirectory}`

    return serviceViewFolder
  })

  viewFallback = viewFallback.concat(serviceViewFolders)

  return viewFallback
}

const configureNunjucks = (viewFallback: string[]): void => {
  nunjucks.configure(viewFallback, {
    autoescape: true,
  })
}
