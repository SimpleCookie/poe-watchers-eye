import Button from './Button'

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
            <Button
              dark={dark}
              variant="outline"
              size="xs"
              onClick={() => onUnhideMod(id)}
              title="Unhide"
            >
              ↩ unhide
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
