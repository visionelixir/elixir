import { ElixirView } from '../View'
import { ViewError } from '../ViewError'

describe('View: View', () => {
  it ('can be instantiated', () => {
    const view = new ElixirView()

    expect(view).toBeInstanceOf(ElixirView)
  })

  it ('can render a view', async () => {
    const view = new ElixirView()
    const result = await view.render(__dirname + '/../../../test/views/test-view.njk')

    expect(result).toBe('test-view content')
  })

  it ('errors if the view is not found', async () => {
    const view = new ElixirView()
    await expect(view.render('something')).rejects.toThrow(ViewError)
  })

  it ('adds the extension if it does not exist', async() => {
    const view = new ElixirView()
    const result = await view.render(__dirname + '/../../../test/views/test-view')

    expect(result).toBe('test-view content')
  })
})