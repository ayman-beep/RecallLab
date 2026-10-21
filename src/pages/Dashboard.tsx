import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { concepts, weeks } from '../data/curriculum'
import { buildOverview, dueCards, heatmap, weekStats } from '../engine/stats'
import { displayStreak, studiedOn } from '../engine/streak'
import { formatDay, formatDuration, formatLongDay, greeting, relativeDay } from '../utils/dates'
import { StatTile } from '../components/ui/StatTile'
import { ProgressBar } from '../components/ui/ProgressBar'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { WeeklyMasteryGrid } from '../components/WeeklyMasteryGrid'
import { LeitnerChart } from '../components/LeitnerChart'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { BOX_META } from '../engine/scheduler'
import type { LeitnerBox } from '../types'
import { Badge } from '../components/ui/Badge'

export default function Dashboard() {
  const { state, today, settings, cards } = useAppState()
  const navigate = useNavigate()
  const [boxFilter, setBoxFilter] = useState<LeitnerBox | null>(null)

  const overview = useMemo(() => buildOverview(concepts, state, today), [state, today])
  const stats = useMemo(() => weekStats(weeks, concepts, cards, today), [cards, today])
  const due = useMemo(() => dueCards(concepts, cards, today), [cards, today])
  const streak = displayStreak(state.streak, today)
  const studied = studiedOn(state.streak, today)
  const goalPercent = Math.min(100, Math.round((overview.attemptsToday / Math.max(1, settings.dailyGoal)) * 100))
  const heat = useMemo(() => heatmap(state, 14), [state])

  const nextWeek = useMemo(() => {
    const ordered = [...stats].sort((a, b) => a.week - b.week)
    const unfinished = ordered.find((s) => s.notStarted > 0 || s.learning > 0)
    if (unfinished) return unfinished.week
    const lowest = ordered.sort((a, b) => a.masteryPercent - b.masteryPercent)[0]
    return lowest?.week ?? 1
  }, [stats])

  const boxCards = useMemo(() => {
    if (!boxFilter) return []
    return concepts.filter((c) => cards[c.id]?.gatePassed && cards[c.id]?.box === boxFilter)
  }, [boxFilter, cards])

  const startStudy = () => {
    if (overview.dueToday > 0) {
      navigate('/study?scope=due&type=review&limit=12')
    } else {
      navigate(`/study?scope=module&week=${nextWeek}&type=learn&limit=${settings.sessionSize}`)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={formatLongDay(today)}
        title={`${greeting()}. Ready for some active recall?`}
        description={
          studied
            ? `You've already studied today — ${overview.attemptsToday} submissions and a ${streak}-day streak to protect.`
            : overview.totalAttempts === 0
              ? 'Start with Week 1 and answer three in a row correctly to unlock the spaced-repetition schedule.'
              : 'A short session today keeps every scheduled card in its Leitner box.'
        }
        actions={
          <>
            <button type="button" className="btn-secondary" onClick={() => navigate('/learn')}>
              Choose a module
            </button>
            <button type="button" className="btn-primary" onClick={startStudy}>
              <Play size={15} aria-hidden="true" />
              {overview.dueToday > 0 ? `Review ${overview.dueToday} due` : 'Start studying'}
            </button>
          </>
        }
      />

      {/* Daily goal */}
      <section className="card mb-4 overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Target size={15} className="text-amber-300" aria-hidden="true" />
              <h2 className="text-sm font-semibold">Today’s goal</h2>
              <Badge tone={goalPercent >= 100 ? 'brand' : 'amber'}>
                {goalPercent >= 100 ? 'Complete' : `${settings.dailyGoal - overview.attemptsToday > 0 ? settings.dailyGoal - overview.attemptsToday : 0} to go`}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-app-muted">
              {overview.attemptsToday} of {settings.dailyGoal} submissions · {overview.correctToday} correct
              {due.length > 0 ? ` · ${due.length} card${due.length === 1 ? '' : 's'} waiting in the review queue` : ''}
            </p>
            <div className="mt-2.5 max-w-md">
              <ProgressBar value={goalPercent} label="Daily study goal" height="md" tone={goalPercent >= 100 ? 'brand' : 'amber'} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="text-center">
              <p className="text-2xl font-semibold tabular-nums leading-none">{streak}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-app-muted">
                <Flame size={10} className={streak ? 'text-amber-400' : ''} aria-hidden="true" /> day streak
              </p>
            </div>
            <div className="h-10 w-px bg-app-border" aria-hidden="true" />
            <div className="text-center">
              <p className="text-2xl font-semibold tabular-nums leading-none">{state.streak.longest}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-app-muted">longest</p>
            </div>
          </div>
        </div>
        <div className="grid gap-2 border-t border-app-border bg-app-raised/40 p-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`/study?scope=module&week=${nextWeek}&type=learn&limit=${settings.sessionSize}`)}
            className="group flex items-center justify-between rounded-xl border border-app-border bg-app-surface px-3.5 py-3 text-left transition hover:border-brand-500/40"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-brand-400">
                Continue learning
              </span>
              <span className="mt-0.5 block truncate text-sm text-app-text">
                Week {nextWeek} · {weeks[nextWeek - 1]?.title}
              </span>
            </span>
            <ArrowRight size={15} className="ml-2 shrink-0 text-app-muted transition group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/review')}
            className="group flex items-center justify-between rounded-xl border border-app-border bg-app-surface px-3.5 py-3 text-left transition hover:border-amber-400/40"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                Review queue
              </span>
              <span className="mt-0.5 block truncate text-sm text-app-text">
                {overview.dueToday > 0
                  ? `${overview.dueToday} due today${overview.overdue ? ` · ${overview.overdue} overdue` : ''}`
                  : 'Nothing due — free practice available'}
              </span>
            </span>
            <ArrowRight size={15} className="ml-2 shrink-0 text-app-muted transition group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Progress overview */}
      <section className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile
          label="Curriculum mastery"
          value={`${overview.masteryPercent}%`}
          hint={`${overview.mastered} of ${overview.totalConcepts} concepts scheduled`}
          icon={TrendingUp}
          tone="brand"
        />
        <StatTile
          label="Concepts mastered"
          value={overview.mastered}
          hint={`${overview.deepMastered} in Box 5 · deep mastery`}
          icon={CheckCircle2}
          tone="cyan"
        />
        <StatTile
          label="In progress"
          value={overview.learning}
          hint="Gate open — three in a row required"
          icon={Brain}
          tone="amber"
        />
        <StatTile
          label="Due for review"
          value={overview.dueToday}
          hint={overview.overdue > 0 ? `${overview.overdue} overdue` : 'Scheduled for today or earlier'}
          icon={CalendarClock}
          tone={overview.dueToday > 0 ? 'amber' : 'muted'}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Weekly mastery */}
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Weekly mastery"
            description="Every week, from not started to mastered. Click a week to open its module."
            icon={<BookOpen size={15} aria-hidden="true" />}
            actions={
              <Link to="/curriculum" className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:underline">
                All modules <ChevronRight size={12} aria-hidden="true" />
              </Link>
            }
          />
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-app-muted">
            {[
              { label: 'Box 5 (deep mastery)', className: 'bg-cyan-400/90' },
              { label: 'Scheduled', className: 'bg-brand-500/70' },
              { label: 'Learning', className: 'bg-amber-400/60' },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.className}`} aria-hidden="true" />
                {item.label}
              </span>
            ))}
          </div>
          <WeeklyMasteryGrid weeks={weeks} stats={stats} />
        </section>

        {/* Leitner */}
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Spaced repetition · Leitner boxes"
            description="Click a box to inspect the cards scheduled in it."
            icon={<Layers size={15} aria-hidden="true" />}
          />
          <LeitnerChart counts={overview.boxCounts} selected={boxFilter} onSelect={setBoxFilter} />

          {boxFilter ? (
            <div className="mt-3 rounded-xl border border-app-border bg-app-raised/60 p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
                  Box {boxFilter} · every {BOX_META[boxFilter].short}
                </p>
                <button
                  type="button"
                  onClick={() => setBoxFilter(null)}
                  className="text-[11px] text-app-muted hover:text-app-text"
                >
                  Clear filter
                </button>
              </div>
              {boxCards.length === 0 ? (
                <p className="px-1 py-2 text-xs text-app-muted">No cards in this box yet.</p>
              ) : (
                <ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
                  {boxCards.map((concept) => (
                    <li key={concept.id}>
                      <Link
                        to={`/curriculum/week/${concept.week}#${concept.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition hover:bg-app-surface"
                      >
                        <span className="truncate">{concept.title}</span>
                        <span className="shrink-0 text-[10px] text-app-muted">
                          {relativeDay(cards[concept.id]?.nextReview ?? null, today)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-3 text-[11px] leading-relaxed text-app-muted">
              New cards enter Box 1 after three consecutive correct answers. Correct reviews move a card
              one box along (1 → 3 → 7 → 14 → 30 days); a missed review returns it to Box 1 and re-opens the
              mastery gate.
            </p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-app-border bg-app-raised/60 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-app-muted">Unscheduled</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">
                {overview.totalConcepts - overview.mastered}
              </p>
            </div>
            <div className="rounded-xl border border-app-border bg-app-raised/60 p-2.5">
              <p className="text-[10px] uppercase tracking-wide text-app-muted">Box 5 · deep</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">{overview.boxCounts[5]}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Activity */}
      <section className="card mt-4 p-4 sm:p-5">
        <SectionHeader
          title="Study activity"
          description={`${formatDuration(overview.totalStudyMs)} studied across ${overview.sessionsCount} session${overview.sessionsCount === 1 ? '' : 's'} · ${overview.totalAttempts} submissions.`}
          icon={<Sparkles size={15} aria-hidden="true" />}
          actions={
            <Link to="/statistics" className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:underline">
              Full statistics <ChevronRight size={12} aria-hidden="true" />
            </Link>
          }
        />
        <ActivityHeatmap columns={heat} cell={13} />
        {overview.totalAttempts === 0 && (
          <p className="mt-2 text-[11px] text-app-muted">
            Each square is one day. Complete a session to light up today’s square.
          </p>
        )}
      </section>

      {/* Review preview */}
      {due.length > 0 && (
        <section className="card mt-4 p-4 sm:p-5">
          <SectionHeader
            title="Waiting in the review queue"
            description="Overdue cards are shown first."
            actions={
              <button
                type="button"
                className="btn-secondary !px-3 !py-1.5 text-xs"
                onClick={() => navigate('/study?scope=due&type=review&limit=12')}
              >
                Start review <ArrowRight size={12} aria-hidden="true" />
              </button>
            }
          />
          <ul className="divide-y divide-app-border">
            {due.slice(0, 4).map((row) => (
              <li key={row.concept.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm">{row.concept.title}</p>
                  <p className="text-[11px] text-app-muted">
                    Week {row.concept.week} · {row.concept.topic}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] text-app-muted">{formatDay(row.progress.nextReview)}</span>
                  <Badge tone={row.overdueDays > 0 ? 'red' : 'amber'}>
                    {row.overdueDays > 0 ? `${row.overdueDays}d overdue` : 'Due today'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {overview.totalAttempts === 0 && (
        <section className="card mt-4 border-brand-500/25 bg-brand-500/[0.04] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">New here? Start with Week 1</h2>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-app-muted">
                Each card asks you to type, complete or categorise an answer from memory. Three consecutive
                correct answers clear the mastery gate and schedule your first review for tomorrow.
                {settings.preferredModes.length < 3
                  ? ' Your preferences currently enable only some recall modes.'
                  : ''}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary shrink-0"
              onClick={() => navigate(`/study?scope=module&week=1&type=learn&limit=${settings.sessionSize}`)}
            >
              <Play size={15} aria-hidden="true" /> Begin Week 1
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
