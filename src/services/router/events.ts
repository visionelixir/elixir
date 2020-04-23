import { ElixirEvent, ElixirEvents } from '../..'
import { RouterMiddleware } from './Middleware'
import { EventDispatcherFacade as EventDispatcher } from '../events/facades'

EventDispatcher.on(ElixirEvents.INIT_MIDDLEWARE, async (event: ElixirEvent) => {
  const { middlewareStack } = event.getData()

  middlewareStack.push(RouterMiddleware.attachRoutes())
  middlewareStack.push(RouterMiddleware.allowedMethods())
})

//@todo is this still needed?
EventDispatcher.on(
  ElixirEvents.INIT_SERVICE_SETUP_POST,
  async (event: ElixirEvent) => {
    const { vision } = event.getData()

    const { baseDirectory, services } = vision.getConfig()
    const { directory, routeFile } = services

    services.require.map((service: string) => {
      try {
        const eventPath = `${baseDirectory}/${directory}/${service}/${routeFile}`
        require(eventPath)
      } catch (error) {
        /* Cannot open event file which can be ignored as it's not a requirement of a service */
      }
    })
  },
)
