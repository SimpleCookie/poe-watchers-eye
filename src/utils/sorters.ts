import type { AuraType, WatcherEyeMod } from '../types/watcherEye'
import { getModId } from './modFormat'

export function sortByAuraEntryName(
  a: [string, AuraType],
  b: [string, AuraType],
) {
  return a[0].localeCompare(b[0])
}

export function sortByModAuraThenText(a: WatcherEyeMod, b: WatcherEyeMod) {
  const auraCompare = a.aura.localeCompare(b.aura)
  return auraCompare !== 0 ? auraCompare : a.mod.localeCompare(b.mod)
}

export function sortByPinnedThenAuraThenMod(selectedModSet: Set<string>) {
  return (a: WatcherEyeMod, b: WatcherEyeMod) => {
    const aSelected = selectedModSet.has(getModId(a))
    const bSelected = selectedModSet.has(getModId(b))
    if (aSelected !== bSelected) return aSelected ? -1 : 1
    return sortByModAuraThenText(a, b)
  }
}
