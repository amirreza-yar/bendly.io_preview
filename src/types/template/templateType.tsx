import { StoredFlashing } from '@/types/flashingTypes'

export interface Template {
  name: string
  flashing: StoredFlashing
  owner: string
}
