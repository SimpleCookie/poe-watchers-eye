import { TAG_COLORS_DARK, TAG_COLORS_LIGHT } from '../constants/tagColors'
import type { WatcherEyeMod } from '../types/watcherEye'
import { formatRanges } from '../utils/modFormat'

type ModCardProps = {
  dark: boolean
  modEntry: WatcherEyeMod
  isSelected: boolean
  isCopied: boolean
  onToggleMod: (mod: WatcherEyeMod) => void
  onHideMod: (mod: WatcherEyeMod) => void
  onCopyMod: (mod: WatcherEyeMod) => void
}

export default function ModCard({
  dark,
  modEntry,
  isSelected,
  isCopied,
  onToggleMod,
  onHideMod,
  onCopyMod,
}: ModCardProps) {
  return (
    <li
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
        <button
          type="button"
          onClick={() => onToggleMod(modEntry)}
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
              <span className={`text-[11px] font-mono ${dark ? 'text-zinc-500' : 'text-stone-500'}`}>
                {formatRanges(modEntry.ranges)}
              </span>
            )}
          </div>

          <p
            className={`text-sm leading-snug ${
              isSelected ? (dark ? 'text-amber-100' : 'text-amber-900') : dark ? 'text-zinc-200' : 'text-stone-700'
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
                      ? (TAG_COLORS_DARK[tag] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700')
                      : (TAG_COLORS_LIGHT[tag] ?? 'bg-stone-100 text-stone-500 border-stone-200')
                  }`}
                >
                  {tag.replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </button>

        {!isSelected && (
          <button
            type="button"
            onClick={() => onHideMod(modEntry)}
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

        {isSelected && (
          <button
            type="button"
            onClick={() => onCopyMod(modEntry)}
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
            <span className="text-base leading-none">{isCopied ? '✓' : '⧉'}</span>
            <span>{isCopied ? 'Done' : 'Copy'}</span>
          </button>
        )}
      </div>
    </li>
  )
}
