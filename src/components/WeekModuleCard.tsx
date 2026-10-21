import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, ListChecks } from 'lucide-react'
import type { WeekModule, WeekStats } from '../types'
import { ProgressBar } from './ui/ProgressBar'
import { Badge } from './ui/Badge'
import { modesForWeek } from '../data/curriculum'

const MODE_LABEL = {
  short: 'Short answer',
  cloze: 'Cloze',
  categorize: 'Categorization',
} as const

export function WeekModuleCard({ week, stats }: { week: WeekModule; stats?: WeekStats }) {
  const percent = stats?.masteryPercent ?? 0
  const due = stats?.due ?? 0
  const modes = modesForWeek(week.week)

  return (
    <article
      className="card group relative flex flex-col p-4 transition hover:border-brand-500/35"
      style={{ borderTopColor: `${week.accent}55`, borderTopWidth: 2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: week.accent }}>
            Week {week.week}
          </p>
          <h3 className="mt-1 text-[15px] font-semibold leading-snug">
            <Link to={`/curriculum/week/${week.week}`} className="after:absolute after:inset-0">
              {week.title}
            </Link>
          </h3>
        </div>
        {due > 0 ? (
          <Badge tone="amber">{due} due</Badge>
        ) : percent === 100 ? (
          <Badge tone="cyan">Mastered</Badge>
        ) : percent > 0 ? (
          <Badge tone="brand">In progress</Badge>
        ) : (
          <Badge tone="muted">Not started</Badge>
        )}
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-app-muted">{week.subtitle}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-app-muted">
        <span className="inline-flex items-center gap-1">
          <ListChecks size={12} aria-hidden="true" /> {stats?.total ?? 0} concepts
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} aria-hidden="true" /> ~{week.estimatedMinutes} min
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen size={12} aria-hidden="true" /> {modes.map((m) => MODE_LABEL[m]).join(' · ')}
        </span>
      </div>

      <div className="mt-auto pt-3">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-app-muted">
          <span>Mastery</span>
          <span className="tabular-nums font-medium text-app-text">{percent}%</span>
        </div>
        <ProgressBar value={percent} label={`Week ${week.week} mastery`} height="sm" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-app-muted">
            {stats?.mastered ?? 0} mastered · {stats?.learning ?? 0} learning
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-400">
            Open module <ArrowRight size={12} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}
