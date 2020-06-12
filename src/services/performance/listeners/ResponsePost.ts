import {
  ElixirEvent,
  ElixirEvents,
  EventDispatcherFacade as EventDispatcher,
  KeyValue,
  NumberUtil,
  PerformanceMark,
  PerformanceFacade as Performance,
} from '../../..'

export const responsePost = async (event: ElixirEvent): Promise<void> => {
  const { ctx } = event.getData()
  Performance.stop('App:Response')

  const benchmarks = Performance.allArray()
  const payload: KeyValue = {}

  benchmarks.map((mark: PerformanceMark) => {
    payload[mark.getName()] = mark.getDuration()
  })

  ctx.set(
    'x-elixir-response-time',
    `${NumberUtil.round(Performance.get('App:Response').getDuration())}`,
  )

  await EventDispatcher.emit(
    ElixirEvents.APP_DATA,
    new ElixirEvent({ collection: 'performance', payload }),
  )
}
