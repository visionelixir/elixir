import {
  DatabaseManagerFacade as DatabaseManager,
  ElixirEvent,
  ElixirEvents,
  EventDispatcherFacade as EventManager,
} from '../..'

EventManager.on(ElixirEvents.INIT_VARS, async (event: ElixirEvent) => {
  const { ctx } = event.getData()
  const { services } = ctx.vision
  services.database = {
    db: DatabaseManager.get(),
    dbManager: DatabaseManager,
  }
})
