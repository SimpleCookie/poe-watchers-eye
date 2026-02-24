import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AuraPanel from './components/AuraPanel'
import Header from './components/Header'
import ModsPanel from './components/ModsPanel'
import watcherEyeTradeStatMapData from './data/watcher-eye-trade-stat-map.json'
import { watcherEyeMods } from './data/watcherEyeData'
import { useAuraGroups } from './hooks/useAuraGroups'
import { useVisibleMods } from './hooks/useVisibleMods'
import type { WatcherEyeMod } from './types/watcherEye'
import { getModId } from './utils/modFormat'
import { buildTradeSearchUrl } from './utils/tradeSearch'

type TradeStatMapEntry = {
  mod: string
  id: string
}

const watcherEyeTradeStatMap = watcherEyeTradeStatMapData as TradeStatMapEntry[]

function App() {
  const [dark, setDark] = useState(true)
  const [selectedAuras, setSelectedAuras] = useState<string[]>([])
  const [selectedMods, setSelectedMods] = useState<string[]>([])
  const [hiddenMods, setHiddenMods] = useState<string[]>([])
  const [showHiddenMods, setShowHiddenMods] = useState(false)
  const [copiedModId, setCopiedModId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const auraGroups = useAuraGroups(watcherEyeMods)

  const selectedAuraSet = useMemo(() => new Set(selectedAuras), [selectedAuras])
  const hiddenModSet = useMemo(() => new Set(hiddenMods), [hiddenMods])
  const selectedModSet = useMemo(() => new Set(selectedMods), [selectedMods])
  const modById = useMemo(
    () => new Map(watcherEyeMods.map((mod) => [getModId(mod), mod])),
    [],
  )
  const tradeStatIdByModText = useMemo(
    () => new Map(watcherEyeTradeStatMap.map((entry) => [entry.mod, entry.id])),
    [],
  )

  const visibleMods = useVisibleMods({
    mods: watcherEyeMods,
    hasSelectedAuras: selectedAuras.length > 0,
    selectedAuraSet,
    hiddenModSet,
    selectedModSet,
  })

  const selectedModEntries = useMemo(
    () => selectedMods.map((id) => modById.get(id)).filter((mod): mod is WatcherEyeMod => Boolean(mod)),
    [selectedMods, modById],
  )

  const selectedTradeStatIds = useMemo(
    () =>
      [...new Set(selectedModEntries.map((mod) => tradeStatIdByModText.get(mod.mod)).filter((id): id is string => Boolean(id)))],
    [selectedModEntries, tradeStatIdByModText],
  )

  const tradeSearchUrl = useMemo(
    () => (selectedTradeStatIds.length > 0 ? buildTradeSearchUrl(selectedTradeStatIds) : null),
    [selectedTradeStatIds],
  )

  function toggleAura(name: string) {
    setSelectedAuras((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    )
  }

  function hideMod(m: WatcherEyeMod) {
    const id = getModId(m)
    setHiddenMods((prev) => [...prev, id])
    setSelectedMods((prev) => prev.filter((x) => x !== id))
  }

  function unhideMod(id: string) {
    setHiddenMods((prev) => prev.filter((x) => x !== id))
  }

  function toggleMod(m: WatcherEyeMod) {
    const id = getModId(m)
    setSelectedMods((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  async function copyMod(m: WatcherEyeMod) {
    const id = getModId(m)
    await navigator.clipboard.writeText(m.mod)
    setCopiedModId(id)
    setTimeout(() => setCopiedModId(null), 1500)
  }

  function openTradeSearch() {
    if (!tradeSearchUrl) return
    window.open(tradeSearchUrl, '_blank', 'noopener,noreferrer')
  }

  const selectedCount = selectedMods.length
  const visibleCount = visibleMods.length

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-100 text-stone-900'
        }`}
    >
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="max-w-3xl mx-auto px-5 py-6 space-y-4">
        <AuraPanel
          dark={dark}
          selectedAuras={selectedAuras}
          selectedAuraSet={selectedAuraSet}
          auraGroups={auraGroups}
          onToggleAura={toggleAura}
          onClearAuras={() => setSelectedAuras([])}
        />

        <ModsPanel
          dark={dark}
          visibleMods={visibleMods}
          selectedModSet={selectedModSet}
          hiddenMods={hiddenMods}
          showHiddenMods={showHiddenMods}
          copiedModId={copiedModId}
          selectedCount={selectedCount}
          visibleCount={visibleCount}
          onToggleShowHiddenMods={() => setShowHiddenMods((s) => !s)}
          onToggleMod={toggleMod}
          onHideMod={hideMod}
          onCopyMod={copyMod}
          onUnhideMod={unhideMod}
          onOpenTradeSearch={openTradeSearch}
          canOpenTradeSearch={Boolean(tradeSearchUrl)}
        />
      </main>
    </div>
  )
}

export default App
