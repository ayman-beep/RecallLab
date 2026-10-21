import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { CardStatus, LeitnerBox } from '../../types'
import { BOX_META } from '../../engine/scheduler'

type Tone = 'brand' | 'amber' | 'red' | 'violet' | 'cyan' | 'muted' | 'blue'

const TONES: Record<Tone, string> = {
  brand:
    'border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-brand-500/30 dark:text-brand-300',
  amber:
    'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:text-amber-300',
  red: 'border-red-500/35 bg-red-500/10 text-red-700 dark:border-red-500/30 dark:text-red-300',
  violet:
    'border-violet-500/35 bg-violet-500/10 text-violet-700 dark:border-violet-400/30 dark:text-violet-300',
  cyan: 'border-cyan-500/35 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:text-cyan-300',
  blue: 'border-sky-500/35 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:text-sky-300',
  muted: 'border-app-border bg-app-raised text-app-muted',
}

export function Badge({
  children,
  tone = 'muted',
  icon: Icon,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  icon?: LucideIcon
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon size={12} aria-hidden />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: CardStatus }) {
  switch (status) {
    case 'mastered':
      return <Badge tone="cyan">Mastered · Box 5</Badge>
    case 'reviewing':
      return <Badge tone="brand">Scheduled</Badge>
    case 'learning':
      return <Badge tone="amber">Learning</Badge>
    default:
      return <Badge tone="muted">Not started</Badge>
  }
}

export function BoxBadge({ box }: { box: LeitnerBox | 0 }) {
  if (!box) return <Badge tone="muted">Unscheduled</Badge>
  const meta = BOX_META[box]
  const tone: Tone = box === 1 ? 'red' : box === 2 ? 'amber' : box === 3 ? 'amber' : box === 4 ? 'brand' : 'cyan'
  return (
    <Badge tone={tone}>
      Box {box} · {meta.short}
    </Badge>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: 'intro' | 'core' | 'advanced' }) {
  const map = {
    intro: { tone: 'muted' as Tone, label: 'Intro' },
    core: { tone: 'blue' as Tone, label: 'Core' },
    advanced: { tone: 'violet' as Tone, label: 'Advanced' },
  }
  const item = map[difficulty]
  return <Badge tone={item.tone}>{item.label}</Badge>
}

export function ModeBadge({ mode }: { mode: 'short' | 'cloze' | 'categorize' }) {
  const map = {
    short: 'Short answer',
    cloze: 'Cloze',
    categorize: 'Categorization',
  } as const
  return <Badge tone="muted">{map[mode]}</Badge>
}
