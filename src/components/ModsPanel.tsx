import ModCard from './ModCard'
import HiddenModsList from './HiddenModsList'
import PanelCard from './PanelCard'
import PanelHeader from './PanelHeader'
import type { WatcherEyeMod } from '../types/watcherEye'
import { getModId } from '../utils/modFormat'

type ModsPanelProps = {
  dark: boolean
  visibleMods: WatcherEyeMod[]
  selectedModSet: Set<string>
  hiddenMods: string[]
  showHiddenMods: boolean
  copiedModId: string | null
  selectedCount: number
  visibleCount: number
  onToggleShowHiddenMods: () => void
  onToggleMod: (mod: WatcherEyeMod) => void
  onHideMod: (mod: WatcherEyeMod) => void
  onCopyMod: (mod: WatcherEyeMod) => void
  onUnhideMod: (id: string) => void
}

export default function ModsPanel({
  dark,
  visibleMods,
  selectedModSet,
  hiddenMods,
  showHiddenMods,
  copiedModId,
  selectedCount,
  visibleCount,
  onToggleShowHiddenMods,
  onToggleMod,
  onHideMod,
  onCopyMod,
  onUnhideMod,
}: ModsPanelProps) {
  return (
    <PanelCard dark={dark}>
      <PanelHeader
        dark={dark}
        title="Mods"
        rightSlot={
          <div className="flex items-center gap-3">
          {hiddenMods.length > 0 && (
            <button
              onClick={onToggleShowHiddenMods}
              className={`text-xs flex items-center gap-1 ${
                dark ? 'text-zinc-500 hover:text-zinc-300' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span>{showHiddenMods ? '▾' : '▸'}</span>
              Hidden ({hiddenMods.length})
            </button>
          )}
          <div className={`text-xs ${dark ? 'text-zinc-600' : 'text-stone-500'}`}>
            {visibleCount} shown
            {selectedCount > 0 && <span className="ml-2 font-semibold text-amber-400">· {selectedCount} pinned</span>}
          </div>
          </div>
        }
      />

      <ul className="space-y-2">
        {visibleMods.map((modEntry) => {
          const modId = getModId(modEntry)
          return (
            <ModCard
              key={modId}
              dark={dark}
              modEntry={modEntry}
              isSelected={selectedModSet.has(modId)}
              isCopied={copiedModId === modId}
              onToggleMod={onToggleMod}
              onHideMod={onHideMod}
              onCopyMod={onCopyMod}
            />
          )
        })}
      </ul>

      {showHiddenMods && (
        <HiddenModsList dark={dark} hiddenMods={hiddenMods} onUnhideMod={onUnhideMod} />
      )}
    </PanelCard>
  )
}
