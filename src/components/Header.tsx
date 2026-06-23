import Button from './Button'

type HeaderProps = {
  dark: boolean
  onToggleDark: () => void
}

export default function Header({ dark, onToggleDark }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur-md ${dark ? 'bg-zinc-950/85 border-zinc-800/80' : 'bg-stone-100/85 border-stone-200'
        }`}
    >
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
        <a
          href="https://devgroup.se/#projects"
          aria-label="Back to DevGroup website"
          className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium no-underline transition-colors duration-150 ${
            dark ? 'text-zinc-500 hover:text-[#ff6b35]' : 'text-stone-400 hover:text-[#ff6b35]'
          }`}
        >
          <span aria-hidden="true">←</span>
          <span className="hidden sm:inline">DevGroup.se</span>
        </a>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold tracking-tight leading-none">
            <span className="font-extrabold bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Watcher&apos;s Eye
            </span>
            <span className={`ml-2 text-sm font-normal ${dark ? 'text-zinc-400' : 'text-stone-600'}`}>
              Mod Finder
            </span>
          </h1>
          <p className={`text-xs mt-1 ${dark ? 'text-zinc-600' : 'text-stone-500'}`}>
            Select auras · click mods to pin · copy individually
          </p>
        </div>

        <Button
          dark={dark}
          variant="icon"
          size="icon"
          rounded="round"
          onClick={onToggleDark}
          aria-label="Toggle theme"
        >
          {dark ? '☀' : '☾'}
        </Button>
      </div>
    </header>
  )
}
