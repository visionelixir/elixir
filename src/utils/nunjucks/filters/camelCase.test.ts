import { camelCase } from './camelCase'

const environment = {
  filters: {},
  addFilter: jest.fn()
} as any

environment.addFilter.mockImplementation((name: string, callback: any): void => {
  environment.filters[name] = callback
})

beforeEach(jest.clearAllMocks)

describe('utils:nunjucks:filters:camelCase', () => {

  it('should camelcase strings', () => {
    const tests = [
      'hello',
      'hello my friend',
      'hello-my-friend',
      'HELLO-MY-FRIEND',
      'Hello my-friend',
      'Hello_my_Friend',
    ]

    const expected = [
      'hello',
      'helloMyFriend',
      'helloMyFriend',
      'helloMyFriend',
      'helloMyFriend',
      'helloMyFriend',
    ]

    const results = tests.map(test => {
      camelCase(environment)
      return environment.filters['camelCase'](test)
    })

    expect(results).toEqual(expected)
  })
})
