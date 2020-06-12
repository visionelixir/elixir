import { snakeCase } from '../../../..'

const environment = {
  filters: {},
  addFilter: jest.fn()
} as any

environment.addFilter.mockImplementation((name: string, callback: any): void => {
  environment.filters[name] = callback
})

beforeEach(jest.clearAllMocks)

describe('utils:nunjucks:filters:snakeCase', () => {

  it('should snakecase strings', () => {
    const tests = [
      'hello',
      'hello my friend',
      'helloMyFriend',
      'HELLOMyFRIEND',
      'Hello my-friend',
      'Hello_my_Friend'
    ]

    const expected = [
      'hello',
      'hello_my_friend',
      'hello_my_friend',
      'hello_my_friend',
      'hello_my_friend',
      'hello_my_friend',
    ]

    const results = tests.map(test => {
      snakeCase(environment)
      return environment.filters['snakeCase'](test)
    })

    expect(results).toEqual(expected)
  })
})
