import { ElixirCollector } from '../Collector'

describe('Elixir Collector', () => {
  it ('should instantiate', async () => {
    const collector = new ElixirCollector()

    expect(collector).toBeInstanceOf(ElixirCollector)
  })

  it ('should be able to add a collection', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')

    expect(collector['collections']).toHaveProperty('name')
    expect(collector['collections'].name).toEqual(['value'])
  })

  it ('should be able to add multiple to a collection', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')
    collector.add('name', 'value2')

    expect(collector['collections'].name).toEqual(['value', 'value2'])
  })

  it ('should be able to get a collection by name', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')

    const result = collector.get('name')

    expect(result).toEqual(['value'])
  })

  it ('should be able to get all collections', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')
    collector.add('name2', 'value2')

    const result = collector.all()

    expect(result).toEqual({
      name: ['value'],
      name2: ['value2'],
    })
  })

  it ('should be able to clear all the collections', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')
    collector.add('name2', 'value2')

    const result = collector.all()

    expect(result).toEqual({
      name: ['value'],
      name2: ['value2'],
    })

    collector.clear()

    expect(collector['collections']).toEqual({})
  })

  it ('should be able to clear a collection by name', () => {
    const collector = new ElixirCollector()
    collector.add('name', 'value')
    collector.add('name2', 'value2')

    const result = collector.all()

    expect(result).toEqual({
      name: ['value'],
      name2: ['value2'],
    })

    collector.clear('name')

    expect(collector['collections']).toEqual({name2: ['value2']})
  })
})
