import { useMemo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  Flame,
  Gauge,
  History,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
} from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { concepts, weeks } from '../data/curriculum'
import { buildOverview, dueCards, gateOpenCards, mostMissed, weekStats } from '../engine/stats'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDuration } from '../utils/dates'
import { BOX_META, LEITNER_INTERVALS } from '../engine/scheduler'

export default function Learn() {
  const { state, today, settings } = useAppState()
  const navigate = useNavigate()
  const overview = useMemo(() => buildOverview(concepts, state, today), [state, today])
  const stats = useMemo(() => weekStats(weeks, concepts, state.cards, today), [state.cards, today])
  const due = useMemo(() => dueCards(concepts, state.cards, today), [state.cards, today])
  const openGates = useMemo(() => gateOpenCards(concepts, state.cards).filter((r) => r.progress?.attempts), [state.cards])
  const missed = useMemo(() => mostMissed(concepts, state.cards, 5), [state.cards])

  const nextWeek = useMemo(() => {
    const ordered = [...stats].sort((a, b) => a.week - b.week)
    return (ordered.find((s) => s.notStarted > 0 || s.learning > 0) ?? ordered[0]).week
  }, [stats])

  const recent = [...state.sessions].reverse().slice(0, 4)

  const start = (query: string) => navigate(`/study?${query}`)

  return (
    <div>
      <PageHeader
        eyebrow="Active recall engine"
        title="Learn"
        description="Every card is answered from memory until you get it right three times in a row. That clears the mastery gate and schedules the first spaced review."
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() => start(`scope=module&week=${nextWeek}&type=learn&limit=${settings.sessionSize}`)}
          >
            <Sparkles size={15} aria-hidden="true" /> Start learning
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SessionCard
          title="Due reviews"
          count={due.length}
          description={
            due.length > 0
              ? `${overview.overdue} overdue · ${due.length - overview.overdue} due today`
              : 'No scheduled cards are due right now'
          }
          icon={CalendarClock}
          tone="amber"
          actionLabel={due.length > 0 ? 'Start review' : 'Open queue'}
          onClick={() =>
            due.length > 0 ? start('scope=due&type=review&limit=12') : navigate('/review')
          }
          disabled={due.length === 0}
        />
        <SessionCard
          title={`Week ${nextWeek} learning`}
          count={stats.find((s) => s.week === nextWeek)?.notStarted ?? 0}
          description="New concepts first, then anything with an open gate"
          icon={Sparkles}
          tone="brand"
          actionLabel="Start session"
          onClick={() => start(`scope=module&week=${nextWeek}&type=learn&limit=${settings.sessionSize}`)}
        />
        <SessionCard
          title="Open mastery gates"
          count={openGates.length}
          description="Cards answered but not yet proved three times in a row"
          icon={Target}
          tone="violet"
          actionLabel="Drill weak spots"
          onClick={() => start(`scope=weak&type=learn&limit=${settings.sessionSize}`)}
          disabled={openGates.length === 0}
        />
        <SessionCard
          title="Free practice"
          count={concepts.length}
          description="Practise any concept without changing an existing review date"
          icon={Gauge}
          tone="cyan"
          actionLabel="Practise all"
          onClick={() =>
            start(
              `scope=practice&week=${nextWeek}&type=practice&limit=${settings.sessionSize}`,
            )
          }
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="How the engine works"
            description="Deterministic, local, and the same rules for every card."
            icon={<Sparkles size={15} aria-hidden="true" />}
          />
          <ol className="space-y-3">
            {[
              {
                step: '1',
                title: 'Answer from memory',
                body: 'Type the exact term, complete the cloze sentence, or place every item in the right category. No answer is shown before you submit.',
              },
              {
                step: '2',
                title: 'Three in a row',
                body: 'Correct answers build the counter. A single miss shows the correct answer, explains why, and resets the counter to zero.',
              },
              {
                step: '3',
                title: 'Enter the schedule',
                body: 'Clearing the gate puts the card in Box 1 with a review one day later. Since missed cards reset, mastery is never assumed.',
              },
              {
                step: '4',
                title: 'Advance the boxes',
                body: 'A correct scheduled review moves a card one box along. A missed review sends it back to Box 1 and re-opens the gate.',
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-brand-500/35 bg-brand-500/10 text-[11px] font-bold text-brand-300">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-app-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((box) => (
              <div key={box} className="rounded-lg border border-app-border bg-app-raised p-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-app-muted">Box {box}</p>
                <p className="mt-0.5 text-sm font-semibold tabular-nums">{LEITNER_INTERVALS[box]}d</p>
                <p className="text-[10px] text-app-muted">{BOX_META[box].short}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="card p-4 sm:p-5">
            <SectionHeader title="Your weak spots" description="Lowest accuracy across attempted cards." icon={<TrendingDown size={15} aria-hidden="true" />} />
            {missed.length === 0 ? (
              <p className="rounded-xl border border-dashed border-app-border px-3 py-6 text-center text-xs text-app-muted">
                No missed answers yet. Missed concepts will be listed here for targeted drills.
              </p>
            ) : (
              <ul className="space-y-2">
                {missed.map((row) => (
                  <li key={row.concept.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{row.concept.title}</p>
                      <p className="text-[10px] text-app-muted">
                        Week {row.concept.week} · {row.incorrect} miss{row.incorrect === 1 ? '' : 'es'}
                      </p>
                    </div>
                    <Badge tone={row.accuracy < 50 ? 'red' : 'amber'}>{row.accuracy}%</Badge>
                  </li>
                ))}
              </ul>
            )}
            {missed.length > 0 && (
              <button
                type="button"
                className="btn-secondary mt-3 w-full text-xs"
                onClick={() => start(`scope=mistakes&type=practice&limit=${settings.sessionSize}&ids=${missed.map((m) => m.concept.id).join(',')}`)}
              >
                Drill these cards <ArrowRight size={12} aria-hidden="true" />
              </button>
            )}
          </section>

          <section className="card p-4 sm:p-5">
            <SectionHeader title="Recent sessions" icon={<History size={15} aria-hidden="true" />} />
            {recent.length === 0 ? (
              <p className="text-xs text-app-muted">No sessions yet — your first session will appear here.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((session) => (
                  <li key={session.id} className="flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{session.label}</p>
                      <p className="text-[10px] text-app-muted">
                        {new Date(session.startedAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}{' '}
                        · {formatDuration(session.durationMs)}
                      </p>
                    </div>
                    <span className="shrink-0 tabular-nums text-app-muted">
                      {session.correct}/{session.submissions}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between rounded-xl border border-app-border bg-app-raised px-3 py-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-app-muted">
                <Flame size={12} className={overview.attemptsToday ? 'text-amber-400' : ''} aria-hidden="true" />
                Today: {overview.attemptsToday}/{settings.dailyGoal}
              </span>
              <span className="inline-flex items-center gap-1.5 text-app-muted">
                <RotateCcw size={12} aria-hidden="true" />
                {openGates.length} open gates
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={Math.min(100, Math.round((overview.attemptsToday / Math.max(1, settings.dailyGoal)) * 100))}
                label="Daily goal progress"
                height="sm"
                tone="amber"
              />
            </div>
          </section>
        </div>
      </div>

      <section className="mt-4">
        <SectionHeader title="Jump into a module" description="Sessions present the least-known cards first." />
        {weeks.length === 0 ? (
          <EmptyState icon={Sparkles} title="Curriculum unavailable" description="The curriculum data could not be loaded." />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {weeks.map((week) => {
              const s = stats.find((row) => row.week === week.week)
              return (
                <div key={week.week} className="card flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: week.accent }}>
                      Week {week.week}
                    </p>
                    <p className="truncate text-xs font-medium">{week.title}</p>
                    <p className="mt-0.5 text-[10px] text-app-muted">
                      {s?.mastered ?? 0}/{s?.total ?? 0} mastered
                      {s?.due ? ` · ${s.due} due` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary shrink-0 !px-2.5 !py-1.5 text-[11px]"
                    onClick={() => start(`scope=module&week=${week.week}&type=learn&limit=${settings.sessionSize}`)}
                  >
                    Study
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function SessionCard({
  title,
  count,
  description,
  icon: Icon,
  tone,
  actionLabel,
  onClick,
  disabled,
}: {
  title: string
  count: number
  description: string
  icon: LucideIcon
  tone: 'brand' | 'amber' | 'violet' | 'cyan'
  actionLabel: string
  onClick: () => void
  disabled?: boolean
}) {
  const tones = {
    brand: 'text-brand-300 border-brand-500/25 bg-brand-500/[0.07]',
    amber: 'text-amber-300 border-amber-400/25 bg-amber-400/[0.07]',
    violet: 'text-violet-300 border-violet-400/25 bg-violet-400/[0.07]',
    cyan: 'text-cyan-300 border-cyan-400/25 bg-cyan-400/[0.07]',
  } as const

  return (
    <div className="card flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-app-muted">{description}</p>
        </div>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
          <Icon size={16} aria-hidden />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold tabular-nums leading-none">{count}</span>
        <button
          type="button"
          className="btn-secondary !px-2.5 !py-1.5 text-[11px]"
          onClick={onClick}
          disabled={disabled}
        >
          {actionLabel} <ArrowRight size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
