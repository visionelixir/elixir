import * as path from 'path'
import * as nunjucks from 'nunjucks'
import { KeyValue, View, ViewError } from '../..'

export class ElixirView implements View {
  public static EXTENSION = 'njk'

  public render(
    template: string,
    payload?: KeyValue | undefined,
  ): Promise<string | null> {
    return new Promise((resolve, reject) => {
      template = this.resolveView(template)

      if (!template.endsWith(ElixirView.EXTENSION)) {
        template = `${template}.${ElixirView.EXTENSION}`
      }

      nunjucks.render(template, payload, (error, result) => {
        if (error) {
          reject(new ViewError(error.message, error, 'renderError'))
        }

        resolve(result)
      })
    })
  }

  protected resolveView(view: string): string {
    const normalised = path.normalize(view)

    return normalised
  }
}
