import { KeyValue, Next } from '../..'

export interface TaskMiddleware {
  (ctx: KeyValue, next: Next): void
}
