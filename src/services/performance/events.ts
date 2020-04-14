import {
  ElixirEvents,
  EventDispatcherFacade as EventDispatcher,
  KeyValue,
  PerformanceFacade as Performance,
  PerformanceMark,
  NumberUtil,
  ElixirEvent,
} from '../..'

/**
 * Clear
 * Clears the collector on each request
 */
export const appResponsePreHandler = async (): Promise<void> => {
  Performance.clear()
  Performance.start('App:Response')
}

// listen to the event
EventDispatcher.on(ElixirEvents.RESPONSE_PRE, appResponsePreHandler)

/**
 * Output
 * Outputs the collector information at the end of the request
 */
export const appResponsePostHandler = async (
  event: ElixirEvent,
): Promise<void> => {
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

// listen to the event
EventDispatcher.on(ElixirEvents.RESPONSE_POST, appResponsePostHandler)
