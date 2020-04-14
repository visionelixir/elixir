import { ElixirEvent } from '../events/Event'
import { ElixirEvents } from '../../vision/types'
import { LoggerFacade as Logger } from '../logger/facades'
import { EventDispatcherFacade as EventDispatcher } from '../events/facades'
import { CollectorFacade as Collector } from '../collector/facades'

/**
 * App Data
 * Adds app data to the collector
 */
export const appDataHandler = async (event: ElixirEvent): Promise<void> => {
  const { collection, payload } = event.getData()
  Collector.add(collection, payload)
}

EventDispatcher.on(ElixirEvents.APP_DATA, appDataHandler)

/**
 * Response Pre
 * Clears the collector on each request
 */
export const responsePreHandler = async (): Promise<void> => {
  Collector.clear()
}

EventDispatcher.on(ElixirEvents.RESPONSE_PRE, responsePreHandler)

/**
 * Response Post
 * Outputs the collector data
 */
export const responsePostHandler = async (
  event: ElixirEvent,
): Promise<void> => {
  const { ctx } = event.getData()
  const { method, url } = ctx.request
  const { status } = ctx.response

  await EventDispatcher.emit(
    ElixirEvents.APP_DATA,
    new ElixirEvent({
      collection: 'request',
      payload: { method, url, status },
    }),
  )

  Logger.info('Request Data:')
  Logger.debug(Collector.all())
}

EventDispatcher.on(ElixirEvents.RESPONSE_POST, responsePostHandler)
