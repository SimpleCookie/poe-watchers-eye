type HiddenModsListProps = {
  dark: boolean
  hiddenMods: string[]
  onUnhideMod: (id: string) => void
}

export default function HiddenModsList({ dark, hiddenMods, onUnhideMod }: HiddenModsListProps) {
  if (hiddenMods.length === 0) return null

  return (
    <ul
      className={`mt-3 pt-3 border-t space-y-1.5 ${
        dark ? 'border-zinc-800' : 'border-stone-200'
      }`}
    >
      {hiddenMods.map((id) => {
        const label = id.split('::')[1] ?? id
        return (
          <li
            key={id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
              dark ? 'border-zinc-800 bg-zinc-900/50' : 'border-stone-200 bg-stone-50'
            }`}
          >
            <p className={`flex-1 text-xs line-through ${dark ? 'text-zinc-600' : 'text-stone-400'}`}>
              {label}
            </p>
            <button
              onClick={() => onUnhideMod(id)}
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
  )
}
