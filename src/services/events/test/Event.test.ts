import { ElixirEvent } from '../Event'

describe('Elixir Event', () => {
  it ('can be instantiated', () => {
    const event = new ElixirEvent()

    expect(event).toBeInstanceOf(ElixirEvent)
  })

  it ('can be instantiated with data', () => {
    const event = new ElixirEvent('data')

    expect(event['data']).toEqual('data')
  })

  it ('can be instantiated with a name', () => {
    const event = new ElixirEvent(null, 'eventName')

    expect(event['name']).toEqual('eventName')
  })

  it ('can set the name after instantiation', () => {
    const event = new ElixirEvent()
    event.setName('some name')

    expect(event['name']).toEqual('some name')
  })

  it ('can set data after instantiation', () => {
    const event = new ElixirEvent()
    event.setData('some data')

    expect(event['data']).toEqual('some data')
  })

  it ('can return the name', () => {
    const event = new ElixirEvent(null, 'some name')
    const name = event.getName()

    expect(name).toEqual('some name')
  })

  it ('can return the data', () => {
    const event = new ElixirEvent('some data')
    const data = event.getData()

    expect(data).toEqual('some data')
  })

  it ('should have the name event by default', () => {
    const event = new ElixirEvent()
    const defaultName = event.getName()

    expect(defaultName).toEqual('event')
  })
})
