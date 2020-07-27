import { PerformanceFacade as Performance } from '../facades'

export const responsePre = async (): Promise<void> => {
  Performance.clearAll()
  Performance.start('App:Response')
}
