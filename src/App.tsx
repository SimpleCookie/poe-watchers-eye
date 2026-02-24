import { useEffect, useMemo, useState } from 'react'
import './App.css'
import watcherEyeModsData from './data/watcher-eye-mods.json'

type RangeValue = { min: number; max: number }
type WatcherEyeMod = { aura: string; auraType: string; mod: string; ranges: RangeValue[]; tags: string[] }

const watcherEyeMods = watcherEyeModsData as WatcherEyeMod[]

function getModId(m: WatcherEyeMod) {
  return `${m.aura}::${m.mod}`
}

function formatRanges(ranges: RangeValue[]) {
  return ranges
    .map((r) => (r.min === r.max ? `${r.min}` : `${r.min}–${r.max}`))
    .join(' / ')
}

const TAG_COLORS_DARK: Record<string, string> = {
  physical:      'bg-red-950 text-red-300 border-red-800',
  elemental:     'bg-blue-950 text-blue-300 border-blue-800',
  fire:          'bg-orange-950 text-orange-300 border-orange-800',
  cold:          'bg-cyan-950 text-cyan-300 border-cyan-800',
  lightning:     'bg-yellow-950 text-yellow-300 border-yellow-800',
  life:          'bg-green-950 text-green-300 border-green-800',
  mana:          'bg-sky-950 text-sky-300 border-sky-800',
  energy_shield: 'bg-teal-950 text-teal-300 border-teal-800',
  caster:        'bg-purple-950 text-purple-300 border-purple-800',
  curse:         'bg-violet-950 text-violet-300 border-violet-800',
  critical:      'bg-yellow-950 text-yellow-300 border-yellow-800',
  damage:        'bg-rose-950 text-rose-300 border-rose-800',
  attack:        'bg-orange-950 text-orange-300 border-orange-800',
  speed:         'bg-emerald-950 text-emerald-300 border-emerald-800',
  defences:      'bg-zinc-800 text-zinc-300 border-zinc-600',
  armour:        'bg-zinc-800 text-zinc-300 border-zinc-600',
  evasion:       'bg-green-950 text-green-300 border-green-800',
  ailment:       'bg-purple-950 text-purple-300 border-purple-800',
  chaos:         'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800',
  resistance:    'bg-teal-950 text-teal-300 border-teal-800',
}

const TAG_COLORS_LIGHT: Record<string, string> = {
  physical:      'bg-red-50 text-red-700 border-red-200',
  elemental:     'bg-blue-50 text-blue-700 border-blue-200',
  fire:          'bg-orange-50 text-orange-700 border-orange-200',
  cold:          'bg-cyan-50 text-cyan-700 border-cyan-200',
  lightning:     'bg-yellow-50 text-yellow-700 border-yellow-200',
  life:          'bg-green-50 text-green-700 border-green-200',
  mana:          'bg-sky-50 text-sky-700 border-sky-200',
  energy_shield: 'bg-teal-50 text-teal-700 border-teal-200',
  caster:        'bg-purple-50 text-purple-700 border-purple-200',
  curse:         'bg-violet-50 text-violet-700 border-violet-200',
  critical:      'bg-yellow-50 text-yellow-700 border-yellow-200',
  damage:        'bg-rose-50 text-rose-700 border-rose-200',
  attack:        'bg-orange-50 text-orange-700 border-orange-200',
  speed:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  defences:      'bg-stone-100 text-stone-600 border-stone-200',
  armour:        'bg-stone-100 text-stone-600 border-stone-200',
  evasion:       'bg-green-50 text-green-700 border-green-200',
  ailment:       'bg-purple-50 text-purple-700 border-purple-200',
  chaos:         'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  resistance:    'bg-teal-50 text-teal-700 border-teal-200',
}

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

  const auraGroups = useMemo(() => {
    const seen = new Map<string, 'offensive' | 'defensive'>()
    for (const m of watcherEyeMods) {
      if (!seen.has(m.aura)) seen.set(m.aura, m.auraType as 'offensive' | 'defensive')
    }
    const offensive: string[] = []
    const defensive: string[] = []
    ;[...seen.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([aura, type]) => {
        if (type === 'offensive') offensive.push(aura)
        else defensive.push(aura)
      })
    return { offensive, defensive }
  }, [])

  const selectedAuraSet = useMemo(() => new Set(selectedAuras), [selectedAuras])
  const hiddenModSet = useMemo(() => new Set(hiddenMods), [hiddenMods])
  const selectedModSet = useMemo(() => new Set(selectedMods), [selectedMods])

  const visibleMods = useMemo(() => {
    const filtered =
      selectedAuras.length === 0
        ? watcherEyeMods.filter((m) => !hiddenModSet.has(getModId(m)))
        : watcherEyeMods.filter((m) => selectedAuraSet.has(m.aura) && !hiddenModSet.has(getModId(m)))

    return [...filtered].sort((a, b) => {
      const aS = selectedModSet.has(getModId(a))
      const bS = selectedModSet.has(getModId(b))
      if (aS !== bS) return aS ? -1 : 1
      const ac = a.aura.localeCompare(b.aura)
      return ac !== 0 ? ac : a.mod.localeCompare(b.mod)
    })
  }, [selectedAuras.length, selectedAuraSet, hiddenModSet, selectedModSet])

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

  const selectedCount = selectedMods.length
  const visibleCount = visibleMods.length

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-100 text-stone-900'
      }`}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-md ${
          dark
            ? 'bg-zinc-950/85 border-zinc-800/80'
            : 'bg-stone-100/85 border-stone-200'
        }`}
      >
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight leading-none">
              <span className="font-extrabold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Watcher&apos;s Eye
              </span>
              <span
                className={`ml-2 text-sm font-normal ${dark ? 'text-zinc-400' : 'text-stone-600'}`}
              >
                Mod Finder
              </span>
            </h1>
            <p
              className={`text-xs mt-1 ${dark ? 'text-zinc-600' : 'text-stone-500'}`}
            >
              Select auras · click mods to pin · copy individually
            </p>
          </div>

          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 border transition-all ${
              dark
                ? 'bg-zinc-800 border-zinc-700 text-amber-300 hover:bg-zinc-700'
                : 'bg-white border-stone-300 text-stone-500 hover:bg-stone-50 shadow-sm'
            }`}
          >
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6 space-y-4">
        {/* ── Auras ─────────────────────────────────────────── */}
        <section
          className={`rounded-2xl border p-5 ${
            dark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest ${
                dark ? 'text-zinc-500' : 'text-stone-600'
              }`}
            >
              Auras
            </span>
            {selectedAuras.length > 0 && (
              <button
                onClick={() => setSelectedAuras([])}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  dark
                    ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                    : 'border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
                }`}
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {(['offensive', 'defensive'] as const).map((type) => (
              <div key={type}>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${
                    dark ? 'text-zinc-400' : 'text-stone-700'
                  }`}
                >
                  {type === 'offensive' ? '⚔ Offensive' : '🛡 Defensive'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {auraGroups[type].map((aura) => {
                    const sel = selectedAuraSet.has(aura)
                    return (
                      <button
                        key={aura}
                        onClick={() => toggleAura(aura)}
                        aria-pressed={sel}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                          sel
                            ? dark
                              ? 'bg-amber-500/15 border-amber-400/80 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.18)]'
                              : 'bg-amber-100 border-amber-500 text-amber-800 shadow-[0_0_14px_rgba(251,191,36,0.15)]'
                            : dark
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                              : 'bg-white border-stone-300 text-stone-800 hover:border-stone-500 hover:bg-stone-50'
                        }`}
                      >
                        {aura}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>


        </section>

        {/* ── Mods ──────────────────────────────────────────── */}
        <section
          className={`rounded-2xl border p-5 ${
            dark
              ? 'bg-zinc-900 border-zinc-800'
              : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest ${
                dark ? 'text-zinc-500' : 'text-stone-600'
              }`}
            >
              Mods
            </span>
            <div className="flex items-center gap-3">
              {hiddenMods.length > 0 && (
                <button
                  onClick={() => setShowHiddenMods((s) => !s)}
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
                {selectedCount > 0 && (
                  <span className="ml-2 font-semibold text-amber-400">
                    · {selectedCount} pinned
                  </span>
                )}
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {visibleMods.map((modEntry) => {
              const modId = getModId(modEntry)
              const isSelected = selectedModSet.has(modId)
              const isCopied = copiedModId === modId

              return (
                <li
                  key={modId}
                  className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                    isSelected
                      ? dark
                        ? 'border-amber-500/50 bg-amber-950/25 shadow-[0_0_18px_rgba(245,158,11,0.1)]'
                        : 'border-amber-400/70 bg-amber-50 shadow-sm'
                      : dark
                        ? 'border-zinc-800 bg-zinc-800/35 hover:border-zinc-700'
                        : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className="group flex items-stretch">
                    {/* clickable body */}
                    <button
                      type="button"
                      onClick={() => toggleMod(modEntry)}
                      aria-pressed={isSelected}
                      className="flex-1 text-left p-3.5 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? dark
                                ? 'text-amber-300 border-amber-600/60 bg-amber-900/40'
                                : 'text-amber-700 border-amber-300 bg-amber-100'
                              : dark
                                ? 'text-zinc-500 border-zinc-700 bg-zinc-800/80'
                                : 'text-stone-600 border-stone-300 bg-stone-100'
                          }`}
                        >
                          {modEntry.aura}
                        </span>

                        {modEntry.ranges.length > 0 && (
                          <span
                            className={`text-[11px] font-mono ${dark ? 'text-zinc-500' : 'text-stone-500'}`}
                          >
                            {formatRanges(modEntry.ranges)}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm leading-snug ${
                          isSelected
                            ? dark
                              ? 'text-amber-100'
                              : 'text-amber-900'
                            : dark
                              ? 'text-zinc-200'
                              : 'text-stone-700'
                        }`}
                      >
                        {modEntry.mod}
                      </p>

                      {modEntry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {modEntry.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                                dark
                                  ? (TAG_COLORS_DARK[tag] ??
                                    'bg-zinc-800 text-zinc-400 border-zinc-700')
                                  : (TAG_COLORS_LIGHT[tag] ??
                                    'bg-stone-100 text-stone-500 border-stone-200')
                              }`}
                            >
                              {tag.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>

                    {/* hide button — appears on hover for unselected mods */}
                    {!isSelected && (
                      <button
                        type="button"
                        onClick={() => hideMod(modEntry)}
                        aria-label="Hide mod"
                        title="Hide"
                        className={`shrink-0 w-8 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 border-l transition-all duration-150 ${
                          dark
                            ? 'border-zinc-800 text-zinc-600 hover:text-zinc-300'
                            : 'border-stone-200 text-stone-300 hover:text-stone-600'
                        }`}
                      >
                        ✕
                      </button>
                    )}

                    {/* copy button — only on selected mods */}
                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => copyMod(modEntry)}
                        aria-label="Copy mod text"
                        className={`shrink-0 w-14 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold border-l transition-all duration-150 ${
                          isCopied
                            ? dark
                              ? 'border-green-800/60 text-green-400 bg-green-950/40'
                              : 'border-green-200 text-green-600 bg-green-50'
                            : dark
                              ? 'border-amber-800/40 text-amber-400 hover:bg-amber-950/40'
                              : 'border-amber-200 text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        <span className="text-base leading-none">
                          {isCopied ? '✓' : '⧉'}
                        </span>
                        <span>{isCopied ? 'Done' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          {/* ── Hidden mods ───────────────────────────────── */}
          {showHiddenMods && hiddenMods.length > 0 && (
            <ul className={`mt-3 pt-3 border-t space-y-1.5 ${
              dark ? 'border-zinc-800' : 'border-stone-200'
            }`}>
              {hiddenMods.map((id) => {
                const label = id.split('::')[1] ?? id
                return (
                  <li
                    key={id}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                      dark
                        ? 'border-zinc-800 bg-zinc-900/50'
                        : 'border-stone-200 bg-stone-50'
                    }`}
                  >
                    <p className={`flex-1 text-xs line-through ${
                      dark ? 'text-zinc-600' : 'text-stone-400'
                    }`}>
                      {label}
                    </p>
                    <button
                      onClick={() => unhideMod(id)}
                      title="Unhide"
                      className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                        dark
                          ? 'border-zinc-700 text-zinc-500 hover:text-zinc-200 hover:border-zinc-500'
                          : 'border-stone-300 text-stone-400 hover:text-stone-700 hover:border-stone-500'
                      }`}
                    >
                      ↩ unhide
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
