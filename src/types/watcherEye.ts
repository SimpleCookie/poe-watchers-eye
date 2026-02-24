export type RangeValue = { min: number; max: number }

export type AuraType = 'offensive' | 'defensive'

export type WatcherEyeMod = {
  aura: string
  auraType: AuraType
  mod: string
  ranges: RangeValue[]
  tags: string[]
}
