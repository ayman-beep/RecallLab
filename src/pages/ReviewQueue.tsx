import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Info,
  Layers,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { concepts, weeks } from '../data/curriculum'
import { dueCards, upcomingCards } from '../engine/stats'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge, BoxBadge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BOX_META, BOX_ORDER, LEITNER_INTERVALS } from '../engine/scheduler'
import { formatDay, relativeDay } from '../utils/dates'
import type { LeitnerBox } from '../types'

type Tab = 'due' | 'overdue' | 'upcoming' | 'all'

export default function ReviewQueue() {
  const { state, today, settings } = useAppState()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('due')
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all')
  const [boxFilter, setBoxFilter] = useState<LeitnerBox | 'all'>('all')
  const [query, setQuery] = useState('')

  const due = useMemo(() => dueCards(concepts, state.cards, today), [state.cards, today])
  const upcoming = useMemo(() => upcomingCards(concepts, state.cards, today), [state.cards, today])
  const overdue = due.filter((row) => row.overdueDays > 0)
  const dueTodayOnly = due.filter((row) => row.overdueDays === 0)

  const scheduledAll = useMemo(
    () =>
      [...due, ...upcoming].sort((a, b) => {
        const aDay = a.progress.nextReview ?? ''
        const bDay = b.progress.nextReview ?? ''
        return aDay.localeCompare(bDay)
      }),
    [due, upcoming],
  )

  const matches = (conceptId: string, week: number, box: number | undefined): boolean => {
    if (weekFilter !== 'all' && week !== weekFilter) return false
    if (boxFilter !== 'all' && box !== boxFilter) return false
    if (query.trim()) {
      const concept = concepts.find((c) => c.id === conceptId)
      const haystack = `${concept?.title ?? ''} ${concept?.topic ?? ''}`.toLowerCase()
      if (!haystack.includes(query.trim().toLowerCase())) return false
    }
    return true
  }

  const rows =
    tab === 'due'
      ? due.filter((row) => matches(row.concept.id, row.concept.week, row.progress.box))
      : tab === 'overdue'
        ? overdue.filter((row) => matches(row.concept.id, row.concept.week, row.progress.box))
        : tab === 'upcoming'
          ? upcoming.filter((row) => matches(row.concept.id, row.concept.week, row.progress.box))
          : scheduledAll.filter((row) => matches(row.concept.id, row.concept.week, row.progress.box))

  const startIds = rows.map((row) => row.concept.id).slice(0, 25)
  const startReview = () => {
    if (startIds.length === 0) return
    navigate(`/study?scope=mistakes&type=review&limit=${startIds.length}&ids=${startIds.join(',')}`)
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'due', label: 'Due now', count: due.length },
    { id: 'overdue', label: 'Overdue', count: overdue.length },
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'all', label: 'All scheduled', count: scheduledAll.length },
  ]

  const filtersActive = weekFilter !== 'all' || boxFilter !== 'all' || query.trim() !== ''

  return (
    <div>
      <PageHeader
        eyebrow="Leitner spaced repetition"
        title="Review Queue"
        description="Cards appear here on the day their box interval expires. A correct review moves a card forward; a miss returns it to Box 1 and re-opens the mastery gate."
        actions={
          <button type="button" className="btn-primary" onClick={startReview} disabled={rows.length === 0}>
            <Play size={15} aria-hidden="true" /> Start review
            {rows.length > 0 ? ` (${startIds.length})` : ''}
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <QueueStat label="Due now" value={due.length} hint={`${dueTodayOnly.length} due today`} tone="amber" />
        <QueueStat label="Overdue" value={overdue.length} hint="Will not advance until reviewed" tone="red" />
        <QueueStat label="Upcoming" value={upcoming.length} hint="Scheduled for later" tone="muted" />
        <QueueStat
          label="Next 7 days"
          value={upcoming.filter((r) => r.inDays <= 7).length}
          hint="Planned load"
          tone="cyan"
        />
      </div>

      <section className="card mb-4 p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1" role="tablist" aria-label="Review queue views">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  tab === item.id
                    ? 'bg-brand-500/15 text-brand-300'
                    : 'text-app-muted hover:bg-app-raised hover:text-app-text'
                }`}
              >
                {item.label}
                <span className="ml-1.5 rounded bg-app-raised px-1 py-0.5 text-[10px] tabular-nums">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-app-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search concept…"
                aria-label="Search review cards"
                className="w-40 rounded-lg border border-app-border bg-app-raised py-1.5 pl-8 pr-2 text-xs text-app-text placeholder:text-app-muted/70 focus:border-brand-500 focus:outline-none sm:w-48"
              />
            </div>
            <select
              value={weekFilter}
              onChange={(event) => setWeekFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))}
              aria-label="Filter by week"
              className="rounded-lg border border-app-border bg-app-raised px-2 py-1.5 text-xs text-app-text focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All weeks</option>
              {weeks.map((week) => (
                <option key={week.week} value={week.week}>
                  Week {week.week}
                </option>
              ))}
            </select>
            <select
              value={boxFilter}
              onChange={(event) =>
                setBoxFilter(event.target.value === 'all' ? 'all' : (Number(event.target.value) as LeitnerBox))
              }
              aria-label="Filter by Leitner box"
              className="rounded-lg border border-app-border bg-app-raised px-2 py-1.5 text-xs text-app-text focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All boxes</option>
              {BOX_ORDER.map((box) => (
                <option key={box} value={box}>
                  Box {box} · {LEITNER_INTERVALS[box]}d
                </option>
              ))}
            </select>
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setWeekFilter('all')
                  setBoxFilter('all')
                  setQuery('')
                }}
                className="btn-ghost !px-2 !py-1.5 text-xs"
              >
                <X size={12} aria-hidden="true" /> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <EmptyState
          icon={tab === 'upcoming' ? CalendarClock : CheckCircle2}
          title={
            tab === 'due' || tab === 'overdue'
              ? 'Nothing due right now'
              : tab === 'upcoming'
                ? 'No upcoming reviews scheduled'
                : 'No scheduled cards yet'
          }
          description={
            state.cards && Object.keys(state.cards).length > 0
              ? 'Cards enter the schedule after three consecutive correct answers. Study a module to add more, or practise freely without affecting review dates.'
              : 'Answer three in a row correctly in any learning session and the card will be scheduled here for its first review tomorrow.'
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/learn" className="btn-primary">
                Start a learning session
              </Link>
              <Link
                to={`/study?scope=practice&type=practice&limit=${settings.sessionSize}`}
                className="btn-secondary"
              >
                Free practice
              </Link>
            </div>
          }
        />
      ) : (
        <section className="card overflow-hidden">
          <div className="hidden items-center gap-3 border-b border-app-border bg-app-raised/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-app-muted sm:flex">
            <span className="flex-1">Concept</span>
            <span className="w-20 text-center">Box</span>
            <span className="w-28 text-right">Next review</span>
            <span className="w-24 text-right">Status</span>
          </div>
          <ul className="divide-y divide-app-border">
            {rows.map((row) => {
              const box = row.progress.box as LeitnerBox
              const nextReview = row.progress.nextReview
              const overdueDays =
                'overdueDays' in row ? (row as { overdueDays: number }).overdueDays : 0
              return (
                <li key={row.concept.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{row.concept.title}</p>
                    <p className="mt-0.5 text-[11px] text-app-muted">
                      Week {row.concept.week} · {row.concept.topic} ·{' '}
                      {row.progress.attempts} attempt{row.progress.attempts === 1 ? '' : 's'} ·{' '}
                      {row.progress.correct} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap sm:w-24 sm:justify-center">
                    {box ? <BoxBadge box={box} /> : <Badge tone="muted">—</Badge>}
                  </div>
                  <div className="text-left sm:w-28 sm:text-right">
                    <p className="text-xs tabular-nums text-app-text">{formatDay(nextReview)}</p>
                    <p className="text-[10px] text-app-muted">{relativeDay(nextReview, today)}</p>
                  </div>
                  <div className="sm:w-24 sm:text-right">
                    {overdueDays > 0 ? (
                      <Badge tone="red">{overdueDays} overdue</Badge>
                    ) : nextReview && nextReview === today ? (
                      <Badge tone="amber">Due today</Badge>
                    ) : (
                      <Badge tone="muted">Scheduled</Badge>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-app-border bg-app-raised/40 px-4 py-3">
            <p className="text-[11px] text-app-muted">
              Showing {rows.length} card{rows.length === 1 ? '' : 's'}
              {filtersActive ? ' matching your filters' : ''}
            </p>
            <button type="button" className="btn-primary !py-1.5 text-xs" onClick={startReview}>
              Review these cards <ArrowRight size={12} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="card p-4">
          <SectionHeader title="Box distribution" icon={<Layers size={15} aria-hidden="true" />} />
          <div className="space-y-2">
            {BOX_ORDER.map((box) => {
              const count = concepts.filter(
                (c) => state.cards[c.id]?.gatePassed && state.cards[c.id]?.box === box,
              ).length
              const percent = Math.round((count / Math.max(1, concepts.length)) * 100)
              return (
                <div key={box} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[11px] text-app-muted">
                    Box {box} · {LEITNER_INTERVALS[box]}d
                  </span>
                  <div className="flex-1">
                    <ProgressBar value={percent} label={`Box ${box} share`} height="sm" tone="brand" />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[11px] tabular-nums">{count}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-app-muted">
            Interval grows with each successful review: {BOX_ORDER.map((b) => `${b} → ${LEITNER_INTERVALS[b]}d`).join(', ')}.
          </p>
        </section>

        <section className="card border-brand-500/20 bg-brand-500/[0.03] p-4">
          <SectionHeader
            title="Scheduling rules"
            description="Exactly what the engine does — no SM-2 approximation."
            icon={<Info size={15} aria-hidden="true" />}
          />
          <ul className="space-y-2 text-[11px] leading-relaxed text-app-muted">
            <li className="flex gap-2">
              <Sparkles size={12} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              New cards enter Box 1 only after three consecutive correct answers.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              A correct scheduled review advances one box; Box 5 stays in Box 5 with another 30-day wait.
            </li>
            <li className="flex gap-2">
              <CalendarClock size={12} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
              A missed review returns the card to Box 1 and clears it from the schedule until the gate is cleared again.
            </li>
            <li className="flex gap-2">
              <Layers size={12} className="mt-0.5 shrink-0 text-cyan-400" aria-hidden="true" />
              Overdue cards stay queued and are sorted before cards due later.
            </li>
            <li className="flex gap-2">
              <Info size={12} className="mt-0.5 shrink-0 text-violet-400" aria-hidden="true" />
              Free practice never moves boxes or review dates.
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {BOX_ORDER.map((box) => (
              <span key={box} className="chip !text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: BOX_META[box].color }} aria-hidden="true" />
                Box {box} = {BOX_META[box].short}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function QueueStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: number
  hint: string
  tone: 'amber' | 'red' | 'muted' | 'cyan'
}) {
  const tones = {
    amber: 'text-amber-300',
    red: 'text-red-300',
    muted: 'text-app-text',
    cyan: 'text-cyan-300',
  } as const
  return (
    <div className="card p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-app-muted">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-[10px] text-app-muted">{hint}</p>
    </div>
  )
}
