import { KeyValue } from '../../vision/types'

export interface ViewConfig {
  serviceViewDirectory: string
  themesDirectory: string
  themeFallback: string[]
}

export interface View {
  render(
    template: string,
    payload?: KeyValue | undefined,
  ): Promise<string | null>
}
