import { ElixirLoader } from '../../utils/Loader'
import { Context, VisionElixirEnvironment } from '../../vision/types'

export default (ctx: Context): void => {
  const Loader: ElixirLoader = ctx.elixir.services('Loader')
  const elixirFventFileName: string = ctx.elixir.config.services.eventFile
  const visionFventFileName: string = ctx.vision.config.services.eventFile

  // load elixir service events
  Loader.runAllServiceFileExports(
    elixirFventFileName,
    VisionElixirEnvironment.ELIXIR,
    [ctx],
  )

  // load vision service events
  Loader.runAllServiceFileExports(
    visionFventFileName,
    VisionElixirEnvironment.VISION,
    [ctx],
  )
}
