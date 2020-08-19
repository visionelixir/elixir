import { ElixirEvent } from '../events/Event'
import { Context, ElixirEvents } from '../../vision/types'
import { Emitter as IEmitter } from '../events/types'
import { Logger as ILogger } from '../logger/types'
import { Collector as ICollector } from './types'

export default (ctx: Context): void => {
  const {
    Emitter,
    Logger,
    Collector,
  }: {
    Emitter: IEmitter
    Logger: ILogger
    Collector: ICollector
  } = ctx.elixir.services('Emitter', 'Logger', 'Collector')

  Emitter.on(ElixirEvents.APP_DATA, (event: ElixirEvent) => {
    const { collection, payload } = event.getData()
    Collector.add(collection, payload)
  })

  // @todo this should be removed from here into the vision to be handled
  //  how the developer wants
  Emitter.on(ElixirEvents.RESPONSE_POST, async (event: ElixirEvent) => {
    const { ctx } = event.getData()
    const { method, url } = ctx.request
    const { status } = ctx.response

    await Emitter.emit(
      ElixirEvents.APP_DATA,
      new ElixirEvent({
        collection: 'request',
        payload: { method, url, status },
      }),
    )

    Logger.info('Request Data:')
    Logger.debug(Collector.all())
  })
}
