import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AuraPanel from './components/AuraPanel'
import Header from './components/Header'
import ModsPanel from './components/ModsPanel'
import watcherEyeTradeStatMapData from './data/watcher-eye-trade-stat-map.json'
import { watcherEyeMods } from './data/watcherEyeData'
import { useAuraGroups } from './hooks/useAuraGroups'
import { useVisibleMods } from './hooks/useVisibleMods'
import type { ModTradeType } from './types/tradeGroup'
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
  const [modTradeTypes, setModTradeTypes] = useState<Record<string, ModTradeType>>({})

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

  // Build trade entries from selected mods that have a known stat id
  const tradeEntries = useMemo(() =>
    selectedMods
      .map((modId) => {
        const mod = modById.get(modId)
        const statId = mod ? tradeStatIdByModText.get(mod.mod) : undefined
        if (!statId) return null
        return { statId, type: modTradeTypes[modId] ?? 'and' as ModTradeType }
      })
      .filter((e): e is { statId: string; type: ModTradeType } => e !== null),
    [selectedMods, modById, tradeStatIdByModText, modTradeTypes],
  )

  const tradeSearchUrl = useMemo(() => buildTradeSearchUrl(tradeEntries), [tradeEntries])

  // ── Aura handlers ──────────────────────────────────────────────────────────
  function toggleAura(name: string) {
    setSelectedAuras((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    )
  }

  // ── Mod handlers ───────────────────────────────────────────────────────────
  function toggleMod(m: WatcherEyeMod) {
    const id = getModId(m)
    if (selectedModSet.has(id)) {
      setSelectedMods((prev) => prev.filter((x) => x !== id))
      setModTradeTypes((prev) => { const next = { ...prev }; delete next[id]; return next })
    } else {
      setSelectedMods((prev) => [...prev, id])
      setModTradeTypes((prev) => ({ ...prev, [id]: 'and' }))
    }
  }

  function hideMod(m: WatcherEyeMod) {
    const id = getModId(m)
    setHiddenMods((prev) => [...prev, id])
    setSelectedMods((prev) => prev.filter((x) => x !== id))
    setModTradeTypes((prev) => { const next = { ...prev }; delete next[id]; return next })
  }

  function unhideMod(id: string) {
    setHiddenMods((prev) => prev.filter((x) => x !== id))
  }

  async function copyMod(m: WatcherEyeMod) {
    const id = getModId(m)
    await navigator.clipboard.writeText(m.mod)
    setCopiedModId(id)
    setTimeout(() => setCopiedModId(null), 1500)
  }

  const CYCLE_ORDER: ModTradeType[] = ['and', 'count', 'not']

  function cycleModTradeType(m: WatcherEyeMod) {
    const id = getModId(m)
    setModTradeTypes((prev) => {
      const current = prev[id] ?? 'and'
      const nextIdx = (CYCLE_ORDER.indexOf(current) + 1) % CYCLE_ORDER.length
      return { ...prev, [id]: CYCLE_ORDER[nextIdx] }
    })
  }

  function openTradeSearch() {
    if (!tradeSearchUrl) return
    window.open(tradeSearchUrl, '_blank', 'noopener,noreferrer')
  }

  const selectedCount = selectedMods.length
  const visibleCount = visibleMods.length

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-100 text-stone-900'}`}
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
          modTradeTypes={modTradeTypes}
          canOpenTrade={Boolean(tradeSearchUrl)}
          onToggleShowHiddenMods={() => setShowHiddenMods((s) => !s)}
          onToggleMod={toggleMod}
          onHideMod={hideMod}
          onCopyMod={copyMod}
          onUnhideMod={unhideMod}
          onCycleModTradeType={cycleModTradeType}
          onOpenTrade={openTradeSearch}
        />

      </main>
    </div>
  )
}

export default App

