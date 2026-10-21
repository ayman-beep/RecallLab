import type { LucideIcon } from 'lucide-react'

interface StatTileProps {
  label: string
  value: string | number
  hint?: string
  icon?: LucideIcon
  tone?: 'brand' | 'amber' | 'violet' | 'red' | 'cyan' | 'muted'
}

const TONES: Record<NonNullable<StatTileProps['tone']>, string> = {
  brand: 'text-emerald-700 dark:text-brand-300 bg-emerald-500/10 border-emerald-600/25 dark:border-brand-500/25',
  amber: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30 dark:border-amber-400/25',
  violet: 'text-violet-700 dark:text-violet-300 bg-violet-500/10 border-violet-500/30 dark:border-violet-400/25',
  red: 'text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30 dark:border-red-500/25',
  cyan: 'text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/30 dark:border-cyan-400/25',
  muted: 'text-app-muted bg-app-raised border-app-border',
}

export function StatTile({ label, value, hint, icon: Icon, tone = 'muted' }: StatTileProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-app-muted">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums leading-none">{value}</p>
          {hint && <p className="mt-2 text-xs leading-snug text-app-muted">{hint}</p>}
        </div>
        {Icon && (
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${TONES[tone]}`}>
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  )
}
