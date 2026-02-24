import type { ReactNode } from 'react'

type PanelCardProps = {
  dark: boolean
  children: ReactNode
}

export default function PanelCard({ dark, children }: PanelCardProps) {
  return (
    <section
      className={`rounded-2xl border p-5 ${
        dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200 shadow-sm'
      }`}
    >
      {children}
    </section>
  )
}
