export const AssetLoaderMock = () => ({
  AssetLoader: {
    loadConfig: jest.fn(() => ({
      themesDirectory: 'themes',
      themeFallback: [ 'theme-a', 'theme-b', 'theme-c' ],
      serviceViewDirectory: 'views'
    } as any)),
    getVisionConfig: jest.fn(() => ({
      baseDirectory: 'baseDir',
      services: {
        directory: 'servicesDir',
        require: [ 'service-a', 'service-b' ]
      }
    } as any)),
    getConfig: jest.fn(() => ({
      name: 'myApp'
    })),
    runAllServiceSetupFiles: jest.fn(),
    loadAllServiceRoutes: jest.fn(),
    loadAllServiceEvents: jest.fn(),
  },
})
