import { PerformanceFacade as Performance } from '../../..'

export const responsePre = async (): Promise<void> => {
  Performance.clear()
  Performance.start('App:Response')
}
