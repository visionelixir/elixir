import { dashCase } from '../../../..'

const environment = {
  filters: {},
  addFilter: jest.fn()
} as any

environment.addFilter.mockImplementation((name: string, callback: any): void => {
  environment.filters[name] = callback
})

beforeEach(jest.clearAllMocks)

describe('utils:nunjucks:filters:dashCase', () => {

  it('should dashcase strings', () => {
    const tests = [
      'hello',
      'hello my friend',
      'helloMyFriend',
      'HELLOMyFRIEND',
      'Hello my-friend',
      'Hello_my_Friend',
    ]

    const expected = [
      'hello',
      'hello-my-friend',
      'hello-my-friend',
      'hello-my-friend',
      'hello-my-friend',
      'hello-my-friend',
    ]

    const results = tests.map(test => {
      dashCase(environment)
      return environment.filters['dashCase'](test)
    })

    expect(results).toEqual(expected)
  })
})
