import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarClock } from 'lucide-react'
import type { WeekModule, WeekStats } from '../types'

interface Props {
  weeks: WeekModule[]
  stats: WeekStats[]
}

const STATUS_LABEL: Record<WeekStats['status'], string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  mastered: 'Mastered',
  due: 'Due for review',
}

export function WeeklyMasteryGrid({ weeks, stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {weeks.map((week) => {
        const s = stats.find((row) => row.week === week.week)
        const masteryPercent = s?.masteryPercent ?? 0
        const due = s?.due ?? 0
        const deepPercent = s ? Math.round((s.deepMastered / Math.max(1, s.total)) * 100) : 0
        return (
          <Link
            key={week.week}
            to={`/curriculum/week/${week.week}`}
            className="group rounded-lg border border-app-border bg-app-surface px-2.5 py-2 transition hover:border-brand-500/40 hover:bg-app-raised focus-visible:border-brand-500"
            aria-label={`Week ${week.week}: ${week.title}. ${STATUS_LABEL[s?.status ?? 'not-started']}, ${masteryPercent}% mastery, ${due} due for review.`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                    Week {week.week}
                  </span>
                  {due > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                      <CalendarClock size={10} aria-hidden="true" />
                      {due}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[12px] font-medium leading-snug text-app-text">
                  {week.title}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-xs font-semibold tabular-nums text-app-text">{masteryPercent}%</span>
                <ArrowUpRight
                  size={13}
                  className="text-app-muted opacity-0 transition group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-1.5 flex h-1 w-full overflow-hidden rounded-full bg-app-raised" aria-hidden="true">
              <div className="h-full bg-cyan-400/90" style={{ width: `${deepPercent}%` }} />
              <div
                className="h-full bg-brand-500/70"
                style={{ width: `${Math.max(0, masteryPercent - deepPercent)}%` }}
              />
              <div
                className="h-full bg-amber-400/60"
                style={{
                  width: `${s ? Math.round((s.learning / Math.max(1, s.total)) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-app-muted">
              <span>{STATUS_LABEL[s?.status ?? 'not-started']}</span>
              <span>
                {s?.mastered ?? 0}/{s?.total ?? 0} mastered
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
