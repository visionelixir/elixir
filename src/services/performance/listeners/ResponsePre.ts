import { PerformanceFacade as Performance } from '../facades'

export const responsePre = async (): Promise<void> => {
  Performance.clear()
  Performance.start('App:Response')
}
