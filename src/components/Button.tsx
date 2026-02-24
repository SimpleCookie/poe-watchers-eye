import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'icon'
type ButtonSize = 'xs' | 'sm' | 'icon'
type ButtonRounded = 'pill' | 'round' | 'soft'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  dark: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  rounded?: ButtonRounded
  className?: string
  children: ReactNode
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const variantClasses: Record<'dark' | 'light', Record<ButtonVariant, string>> = {
  dark: {
    primary: 'bg-amber-500/20 border-amber-400/70 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400 hover:text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.2)] hover:shadow-[0_0_16px_rgba(251,191,36,0.35)] transition-all',
    outline: 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors',
    ghost: 'border-transparent text-zinc-500 hover:text-zinc-300 transition-colors',
    icon: 'bg-zinc-800 border-zinc-700 text-amber-300 hover:bg-zinc-700 transition-all',
  },
  light: {
    primary: 'bg-amber-100 border-amber-500 text-amber-800 hover:bg-amber-200 hover:border-amber-600 shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_16px_rgba(251,191,36,0.25)] transition-all',
    outline: 'border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800 transition-colors',
    ghost: 'border-transparent text-stone-500 hover:text-stone-700 transition-colors',
    icon: 'bg-white border-stone-300 text-stone-500 hover:bg-stone-50 shadow-sm transition-all',
  },
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-[11px] px-2 py-0.5',
  sm: 'text-xs px-2.5 py-1',
  icon: 'w-9 h-9 text-sm',
}

const roundedClasses: Record<ButtonRounded, string> = {
  pill: 'rounded-full',
  round: 'rounded-full',
  soft: 'rounded-lg',
}

export default function Button({
  dark,
  variant = 'outline',
  size = 'sm',
  rounded = 'pill',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const theme = dark ? 'dark' : 'light'
  const variantClass = variantClasses[theme][variant]
  const sizeClass = sizeClasses[size]
  const roundedClass = roundedClasses[rounded]

  return (
    <button
      type={type}
      className={joinClasses(
        'inline-flex items-center justify-center gap-1 border shrink-0 enabled:hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClass,
        roundedClass,
        variantClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
