export const ElixirLoaderMock = () => ({
  ElixirLoader: jest.fn(() => ({
    loadConfig: jest.fn(() => ({
      themesDirectory: 'themes',
      themeFallback: [ 'theme-a', 'theme-b', 'theme-c' ],
      serviceViewDirectory: 'views'
    } as any)),
    getVisionConfig: jest.fn(() => ({
      name: 'App',
      baseDirectory: 'baseDir',
      services: {
        directory: 'servicesDir',
        require: [ 'service-a', 'service-b' ]
      }
    } as any)),
    getConfig: jest.fn(() => ({
      name: 'myApp'
    })),
    runAllServiceRegisterFiles: jest.fn(),
    runAllServiceBootFiles: jest.fn(),
    loadAllServiceRoutes: jest.fn(),
    loadAllServiceEvents: jest.fn(),
    loadServiceAsset: jest.fn(),
    runAllServiceFileExports: jest.fn(),
  })),
})
