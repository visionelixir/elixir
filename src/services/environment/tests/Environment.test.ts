import { EnvironmentCasts } from '../../../../dist/services/environment/types'
import { Environment } from '../Environment'

describe('Environment', () => {
  it('should get', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()
    Environment.vars = {
      variable: 'value'
    }

    const result = Environment.get('variable')

    expect(Environment.fetch).toBeCalledTimes(1)
    expect(result).toBe('value')

    Environment.fetch = original as any
  })

  it('should get casted', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()
    Environment.vars = {
      string: 567,
      boolean: 'true',
      boolean2: 'false',
      boolean3: '0',
      boolean4: '1',
      boolean5: 0,
      boolean6: 1,
      number: '123'
    }

    const def: string | null = Environment.get('string')
    const string: string | null = Environment.get('string', 'default', EnvironmentCasts.STRING)
    const number: number | null = Environment.get('number', 123, EnvironmentCasts.NUMBER)
    const boolean: boolean | null = Environment.get('boolean', false, EnvironmentCasts.BOOLEAN)
    const boolean2: boolean | null = Environment.get('boolean2', false, EnvironmentCasts.BOOLEAN)
    const boolean3: boolean | null = Environment.get('boolean3', false, EnvironmentCasts.BOOLEAN)
    const boolean4: boolean | null = Environment.get('boolean4', false, EnvironmentCasts.BOOLEAN)
    const boolean5: boolean | null = Environment.get('boolean5', false, EnvironmentCasts.BOOLEAN)
    const boolean6: boolean | null = Environment.get('boolean6', false, EnvironmentCasts.BOOLEAN)

    expect(Environment.fetch).toBeCalledTimes(9)
    expect(def).toBe('567')
    expect(string).toBe('567')
    expect(number).toBe(123)
    expect(boolean).toBe(true)
    expect(boolean2).toBe(false)
    expect(boolean3).toBe(false)
    expect(boolean4).toBe(true)
    expect(boolean5).toBe(false)
    expect(boolean6).toBe(true)


    Environment.fetch = original as any
  })

  it ('should not fetch if hasFetched is true when running get()', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()

    Environment.get('variable')
    Environment.hasFetched = true
    Environment.get('variable')

    expect(Environment.fetch).toBeCalledTimes(1)

    Environment.fetch = original as any
    Environment.hasFetched = false
  })

  it('should get all', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()
    Environment.vars = {
      variable: 'value'
    }

    const result = Environment.all()

    expect(Environment.fetch).toBeCalledTimes(1)
    expect(result).toMatchObject({ variable: 'value' })

    Environment.fetch = original as any
  })

  it ('should not fetch if hasFetched is true when running all()', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()

    Environment.all()
    Environment.hasFetched = true
    Environment.all()

    expect(Environment.fetch).toBeCalledTimes(1)

    Environment.fetch = original as any
    Environment.hasFetched = false
  })

  it ('should set vars', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()

    Environment.set('myVariable', 'myValue')

    expect(Environment.vars).toHaveProperty('myVariable')
    expect(Environment.vars.myVariable).toEqual('myValue')
    expect(Environment.fetch).toBeCalledTimes(1)

    Environment.fetch = original as any
    Environment.hasFetched = false
  })

  it ('should fetch only once when calling set', () => {
    const original = Environment.fetch
    Environment.fetch = jest.fn()

    Environment.set('var1', 'value1')
    Environment.hasFetched = true
    Environment.set('var2', 'value2')

    expect(Environment.fetch).toBeCalledTimes(1)

    Environment.fetch = original as any
    Environment.hasFetched = false
  })

  it ('should fetch', () => {
    Environment.loaders = [
      { load: jest.fn().mockImplementation(() => ({ name: 'loader1' })) } as any,
      { load: jest.fn().mockImplementation(() => null) } as any,
      { load: jest.fn().mockImplementation(() => ({ name: 'loader3' })) } as any,
    ]

    expect(Environment.hasFetched).toBe(false)

    Environment.fetch()

    expect(Environment.loaders[0].load).toBeCalledTimes(1)
    expect(Environment.loaders[1].load).toBeCalledTimes(1)
    expect(Environment.loaders[2].load).toBeCalledTimes(1)

    expect(Environment.vars).toMatchObject({
      name: 'loader3'
    })
    expect(Environment.hasFetched).toBe(true)
  })
})