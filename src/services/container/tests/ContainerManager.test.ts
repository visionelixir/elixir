import { ContainerManager } from '../ContainerManager'

describe('Elixir Container Manager', () => {
  it ('should add to the manager', () => {
    expect(ContainerManager['containers']).toMatchObject({})
    ContainerManager.set('myContainer', {} as any)
    expect(ContainerManager['containers']).toMatchObject({
      myContainer: {}
    })
  })

  it ('should be able to get from the manager', () => {
    expect(ContainerManager['containers']).toMatchObject({})
    ContainerManager.set('myContainer', {} as any)
    expect(ContainerManager.get('myContainer')).toMatchObject({})
  })

  it ('should return the default container by default', () => {
    expect(ContainerManager['containers']).toMatchObject({})

    const container = {}
    ContainerManager.set('default', container as any)
    expect(ContainerManager.get()).toMatchObject(container)
  })
})
