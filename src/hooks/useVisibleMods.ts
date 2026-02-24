import { useMemo } from 'react'
import type { WatcherEyeMod } from '../types/watcherEye'
import { getModId } from '../utils/modFormat'
import { sortByPinnedThenAuraThenMod } from '../utils/sorters'

type UseVisibleModsArgs = {
  mods: WatcherEyeMod[]
  hasSelectedAuras: boolean
  selectedAuraSet: Set<string>
  hiddenModSet: Set<string>
  selectedModSet: Set<string>
}

export function useVisibleMods({
  mods,
  hasSelectedAuras,
  selectedAuraSet,
  hiddenModSet,
  selectedModSet,
}: UseVisibleModsArgs) {
  return useMemo(() => {
    const filtered = hasSelectedAuras
      ? mods.filter((mod) => selectedAuraSet.has(mod.aura) && !hiddenModSet.has(getModId(mod)))
      : mods.filter((mod) => !hiddenModSet.has(getModId(mod)))

    return [...filtered].sort(sortByPinnedThenAuraThenMod(selectedModSet))
  }, [mods, hasSelectedAuras, selectedAuraSet, hiddenModSet, selectedModSet])
}
