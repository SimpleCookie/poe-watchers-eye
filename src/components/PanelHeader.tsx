import type { ReactNode } from 'react'

type PanelHeaderProps = {
  dark: boolean
  title: string
  rightSlot?: ReactNode
}

export default function PanelHeader({ dark, title, rightSlot }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span
        className={`text-[11px] font-bold uppercase tracking-widest ${
          dark ? 'text-zinc-500' : 'text-stone-600'
        }`}
      >
        {title}
      </span>
      {rightSlot}
    </div>
  )
}
