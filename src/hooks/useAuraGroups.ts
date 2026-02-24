import { useMemo } from 'react'
import type { AuraType, WatcherEyeMod } from '../types/watcherEye'
import { sortByAuraEntryName } from '../utils/sorters'

type AuraGroups = {
  offensive: string[]
  defensive: string[]
}

export function useAuraGroups(mods: WatcherEyeMod[]) {
  return useMemo<AuraGroups>(() => {
    const seen = new Map<string, AuraType>()
    for (const mod of mods) {
      if (!seen.has(mod.aura)) seen.set(mod.aura, mod.auraType)
    }

    const offensive: string[] = []
    const defensive: string[] = []

      ;[...seen.entries()]
        .sort(sortByAuraEntryName)
        .forEach(([aura, type]) => {
          if (type === 'offensive') offensive.push(aura)
          else defensive.push(aura)
        })

    return { offensive, defensive }
  }, [mods])
}
