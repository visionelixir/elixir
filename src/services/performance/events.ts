import { Context, ElixirEvents, KeyValue } from '../../vision/types'
import { Emitter as IEmitter } from '../events/types'
import { ElixirEvent } from '../events/Event'
import { NumberUtil } from '../../utils/NumberUtil'
import { PerformanceMark } from './PerformanceMark'
import { Performance as IPerformance } from './types'

export default (ctx: Context): void => {
  const Emitter: IEmitter = ctx.elixir.services('Emitter')

  Emitter.on(ElixirEvents.RESPONSE_PRE, (event: ElixirEvent): void => {
    const { ctx } = event.getData()
    const Performance: IPerformance = ctx.elixir.services('Performance')

    Performance.clearAll()
    Performance.start('App:Response')
  })

  Emitter.on(ElixirEvents.RESPONSE_POST, (event: ElixirEvent): void => {
    const { ctx } = event.getData()
    const {
      Performance,
      Emitter,
    }: { Performance: IPerformance; Emitter: IEmitter } = ctx.elixir.services(
      'Performance',
      'Emitter',
    )

    Performance.stop('App:Response')

    const benchmarks = Performance.allArray()
    const payload: KeyValue = {}

    benchmarks.map((mark: PerformanceMark) => {
      // stop the performance mark if it's still running
      mark.stop()
      payload[mark.getName()] = NumberUtil.round(mark.getDuration())
    })

    ctx.set(
      'x-elixir-response-time',
      `${NumberUtil.round(Performance.get('App:Response').getDuration())}`,
    )

    Emitter.emit(
      ElixirEvents.APP_DATA,
      new ElixirEvent({ collection: 'performance', payload }),
    )
  })
}
