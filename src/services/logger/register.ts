import { ElixirLoader } from '../../utils/Loader'
import { Context, KeyValue, VisionElixirEnvironment } from '../../vision/types'
import { Container as IContainer } from '../container/types'
import { Environment } from '../environment/Environment'
import { ElixirLogger } from './Logger'
import { LogType } from './types'

export default (ctx: Context): void => {
  const {
    Container,
    Loader,
  }: { Container: IContainer; Loader: ElixirLoader } = ctx.elixir.services(
    'Container',
    'Loader',
  )

  const loggerType: LogType = Environment.get(
    'LOGGER_TYPE',
    LogType.CONSOLE,
  ) as LogType

  let config: KeyValue = {}

  switch (loggerType) {
    case LogType.GCLOUD:
      config = Loader.loadConfig(
        VisionElixirEnvironment.VISION,
        'googleCloud',
      ) as KeyValue
      break
    case LogType.CONSOLE:
      config = {}
      break
  }

  Container.singleton('Logger', new ElixirLogger(loggerType, config))
}
