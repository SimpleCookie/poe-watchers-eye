import type { RangeValue, WatcherEyeMod } from '../types/watcherEye'

export function getModId(mod: WatcherEyeMod) {
  return `${mod.aura}::${mod.mod}`
}

export function formatRanges(ranges: RangeValue[]) {
  return ranges
    .map((range) => (range.min === range.max ? `${range.min}` : `${range.min}–${range.max}`))
    .join(' / ')
}
