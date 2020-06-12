import { titleCase } from '../../../..'

const environment = {
  filters: {},
  addFilter: jest.fn()
} as any

environment.addFilter.mockImplementation((name: string, callback: any): void => {
  environment.filters[name] = callback
})

beforeEach(jest.clearAllMocks)

describe('utils:nunjucks:filters:titleCase', () => {

  it('should titlecase strings', () => {
    const tests = [
      'hello',
      'hello my friend',
      'helloMyFriend',
      'HELLOMyFRIEND',
      'Hello my-friend',
      'Hello_my_Friend',
    ]

    const expected = [
      'Hello',
      'HelloMyFriend',
      'HelloMyFriend',
      'HelloMyFriend',
      'HelloMyFriend',
      'HelloMyFriend',
    ]

    const results = tests.map(test => {
      titleCase(environment)
      return environment.filters['titleCase'](test)
    })

    expect(results).toEqual(expected)
  })
})
