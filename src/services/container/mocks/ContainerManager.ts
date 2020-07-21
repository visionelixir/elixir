const resolve = jest.fn()

export const ContainerManagerMock = () => ({
  ContainerManager: {
    resolve,
    get: jest.fn(() => ({
      resolve
    })),
    set: jest.fn()
  },
})
