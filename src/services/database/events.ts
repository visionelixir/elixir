import { DatabaseManagerFacade as DatabaseManager } from './facades'
import { EventDispatcherFacade as EventManager } from '../events/facades'
import { ElixirEvent } from '../events/Event'
import { ElixirEvents } from '../../vision/types'

export const initVarsHandler = async (event: ElixirEvent): Promise<void> => {
  const { ctx } = event.getData()
  const { services } = ctx.vision

  services.database = {
    db: DatabaseManager.get(),
    dbManager: DatabaseManager,
  }
}

EventManager.on(ElixirEvents.INIT_VARS, initVarsHandler)
