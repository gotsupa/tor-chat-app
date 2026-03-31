'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const THEME_OPTIONS = [
  { icon: MonitorIcon, label: 'System', value: 'system' },
  { icon: SunIcon, label: 'Light', value: 'light' },
  { icon: MoonIcon, label: 'Dark', value: 'dark' },
] as const

const emptySubscribe = () => () => {}

export function ThemeSelect() {
  const { setTheme, theme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Prevent hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <MonitorIcon className="size-4" />
      </div>
    )
  }

  const currentOption = THEME_OPTIONS.find((opt) => opt.value === theme)
  const Icon = currentOption?.icon ?? MonitorIcon

  return (
    <div className="relative flex items-center">
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 size-3.5 text-foreground/60"
      />
      <select
        aria-label="Select theme"
        className="h-8 cursor-pointer appearance-none rounded-full bg-secondary py-1 pl-7.5 pr-6 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onChange={(e) => setTheme(e.target.value)}
        value={theme}
      >
        {THEME_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-2 size-3 text-foreground/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
