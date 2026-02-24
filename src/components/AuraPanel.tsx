import Button from './Button'
import PanelCard from './PanelCard'
import PanelHeader from './PanelHeader'

type AuraPanelProps = {
  dark: boolean
  selectedAuras: string[]
  selectedAuraSet: Set<string>
  auraGroups: { offensive: string[]; defensive: string[] }
  onToggleAura: (name: string) => void
  onClearAuras: () => void
}

export default function AuraPanel({
  dark,
  selectedAuras,
  selectedAuraSet,
  auraGroups,
  onToggleAura,
  onClearAuras,
}: AuraPanelProps) {
  return (
    <PanelCard dark={dark}>
      <PanelHeader
        dark={dark}
        title="Auras"
        rightSlot={
          selectedAuras.length > 0 && (
            <Button
              dark={dark}
              variant="outline"
              size="sm"
              onClick={onClearAuras}
            >
              Clear
            </Button>
          )
        }
      />

      <div className="space-y-3">
        {(['offensive', 'defensive'] as const).map((type) => (
          <div key={type}>
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${dark ? 'text-zinc-400' : 'text-stone-700'
                }`}
            >
              {type === 'offensive' ? '⚔ Offensive' : '🛡 Defensive'}
            </p>
            <div className="flex flex-wrap gap-2">
              {auraGroups[type].map((aura) => {
                const selected = selectedAuraSet.has(aura)
                return (
                  <button
                    key={aura}
                    onClick={() => onToggleAura(aura)}
                    aria-pressed={selected}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${selected
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
    </PanelCard>
  )
}
