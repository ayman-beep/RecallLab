import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Target,
  TrendingDown,
} from 'lucide-react'
import { getConceptsForWeek, getWeek, weeks } from '../data/curriculum'
import { useAppState } from '../context/AppStateContext'
import { bucketFor } from '../engine/stats'
import { ConceptCard } from '../components/ConceptCard'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { StatTile } from '../components/ui/StatTile'
import { SectionHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'

export default function ModulePage() {
  const { week: weekParam } = useParams()
  const navigate = useNavigate()
  const { state, today, settings } = useAppState()
  const weekNumber = Number(weekParam)
  const week = getWeek(weekNumber)
  const weekConcepts = useMemo(() => getConceptsForWeek(weekNumber), [weekNumber])
  const bucket = useMemo(
    () => bucketFor(weekConcepts, state.cards, today),
    [weekConcepts, state.cards, today],
  )

  useEffect(() => {
    if (!window.location.hash) return
    const el = document.getElementById(window.location.hash.slice(1))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-brand-500/50')
      window.setTimeout(() => el.classList.remove('ring-2', 'ring-brand-500/50'), 2200)
    }
  }, [weekNumber])

  if (!week) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Module not found"
        description="That week does not exist. Pick one of the 14 modules from the curriculum page."
        action={
          <Link to="/curriculum" className="btn-primary">
            Back to curriculum
          </Link>
        }
      />
    )
  }

  const prev = weeks.find((w) => w.week === weekNumber - 1)
  const next = weeks.find((w) => w.week === weekNumber + 1)
  const weakConcepts = weekConcepts.filter((c) => {
    const p = state.cards[c.id]
    return (p && !p.gatePassed && p.attempts > 0) || (p && p.incorrect > 0)
  })

  const base = `scope=module&week=${week.week}&type=learn&limit=${settings.sessionSize}`

  return (
    <div>
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-app-muted" aria-label="Breadcrumb">
        <Link to="/curriculum" className="hover:text-app-text">
          Curriculum
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-app-text">Week {week.week}</span>
      </nav>

      <header
        className="card mb-4 overflow-hidden border-t-2 p-5"
        style={{ borderTopColor: week.accent }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: week.accent }}>
              Week {week.week} of 14
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight">{week.title}</h1>
            <p className="mt-1 text-sm text-app-muted">{week.subtitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-app-muted">{week.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge tone="muted" icon={Clock}>
                ~{week.estimatedMinutes} min
              </Badge>
              <Badge tone="muted" icon={BookOpen}>
                {weekConcepts.length} concepts
              </Badge>
              {bucket.due > 0 && <Badge tone="amber">{bucket.due} due for review</Badge>}
            </div>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-app-border bg-app-raised/60 p-3.5 lg:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="text-app-muted">Module mastery</span>
              <span className="font-semibold tabular-nums">{bucket.masteryPercent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={bucket.masteryPercent} label={`Week ${week.week} mastery`} height="md" />
            </div>
            <p className="mt-2 text-[11px] text-app-muted">
              {bucket.deepMastered + bucket.reviewing} of {bucket.total} concepts scheduled ·{' '}
              {bucket.notStarted} not started
            </p>
            <div className="mt-3 grid gap-1.5">
              <button
                type="button"
                className="btn-primary w-full !py-2 text-xs"
                onClick={() => navigate(`/study?${base}`)}
              >
                <Play size={13} aria-hidden="true" /> Start learning
              </button>
              <button
                type="button"
                className="btn-secondary w-full !py-2 text-xs"
                onClick={() =>
                  navigate(`/study?scope=practice&week=${week.week}&type=practice&limit=${settings.sessionSize}`)
                }
              >
                <Target size={13} aria-hidden="true" /> Practice quiz
              </button>
              <button
                type="button"
                className="btn-secondary w-full !py-2 text-xs"
                disabled={weakConcepts.length === 0}
                onClick={() =>
                  navigate(
                    `/study?scope=weak&week=${week.week}&type=learn&limit=${settings.sessionSize}`,
                  )
                }
              >
                <TrendingDown size={13} aria-hidden="true" /> Review weak concepts
                {weakConcepts.length > 0 ? ` (${weakConcepts.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile label="Mastered" value={bucket.deepMastered + bucket.reviewing} hint="Gate cleared and scheduled" icon={CheckCircle2} tone="brand" />
        <StatTile label="Learning" value={bucket.learning} hint="Gate open" icon={Target} tone="amber" />
        <StatTile label="Due now" value={bucket.due} hint="Today or overdue" icon={CalendarClock} tone={bucket.due ? 'amber' : 'muted'} />
        <StatTile label="Not started" value={bucket.notStarted} hint="Never attempted" icon={BookOpen} tone="muted" />
      </div>

      <section className="card mb-4 p-4 sm:p-5">
        <SectionHeader title="Learning objectives" description="By the end of this module you should be able to:" />
        <ul className="grid gap-2 sm:grid-cols-2">
          {week.learningObjectives.map((objective) => (
            <li key={objective} className="flex gap-2 text-[13px] leading-relaxed text-app-muted">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-400" aria-hidden="true" />
              {objective}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-app-border pt-3">
          {week.topics.map((topic) => (
            <span key={topic} className="chip">
              {topic}
            </span>
          ))}
        </div>
      </section>

      <SectionHeader
        title={`Concepts (${weekConcepts.length})`}
        description="Expand a card for key facts, examples and related concepts."
        actions={
          <button
            type="button"
            className="btn-secondary !px-2.5 !py-1.5 text-[11px]"
            onClick={() => navigate(`/study?${base}`)}
          >
            <RotateCcw size={12} aria-hidden="true" /> Drill all
          </button>
        }
      />
      <div className="grid gap-2.5 xl:grid-cols-2">
        {weekConcepts.map((concept) => (
          <div key={concept.id} id={concept.id} className="scroll-mt-24 rounded-2xl transition">
            <ConceptCard
              concept={concept}
              progress={state.cards[concept.id]}
              today={today}
              onPractice={(c) =>
                navigate(`/study?scope=mistakes&type=practice&limit=1&ids=${c.id}`)
              }
            />
          </div>
        ))}
      </div>

      <nav className="mt-6 flex items-center justify-between gap-2" aria-label="Module navigation">
        {prev ? (
          <Link to={`/curriculum/week/${prev.week}`} className="btn-secondary text-xs">
            <ArrowLeft size={13} aria-hidden="true" /> Week {prev.week}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/curriculum/week/${next.week}`} className="btn-secondary text-xs">
            Week {next.week} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
