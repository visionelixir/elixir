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
})
