import { ElixirFacade, Collector } from '../..'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const CollectorFacade: Collector = new ElixirFacade(
  'Collector',
) as Collector
