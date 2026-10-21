import { Link } from 'react-router-dom'
import { CalendarClock, ChevronDown, ChevronUp, Link2, Play, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { CardProgress, CardStatus, Concept } from '../types'
import { Badge, BoxBadge, DifficultyBadge, ModeBadge, StatusBadge } from './ui/Badge'
import { MasteryCounter } from './MasteryCounter'
import { cardStatus } from '../engine/scheduler'
import { formatDay, relativeDay, type ISODay } from '../utils/dates'
import { getRelatedConcepts } from '../data/curriculum'

interface Props {
  concept: Concept
  progress?: CardProgress
  today: ISODay
  /** Start a single-card practice session. */
  onPractice?: (concept: Concept) => void
  defaultOpen?: boolean
}

export function ConceptCard({ concept, progress, today, onPractice, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const status = cardStatus(progress)
  const related = getRelatedConcepts(concept)

  return (
    <article className="card overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-app-muted">
                {concept.topic}
              </span>
              <DifficultyBadge difficulty={concept.difficulty} />
              <ModeBadge mode={concept.drill.mode} />
            </div>
            <h3 className="text-[15px] font-semibold leading-snug">{concept.title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <StatusBadge status={status} />
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-app-muted">{concept.definition}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {progress?.gatePassed ? (
              <>
                <BoxBadge box={progress.box} />
                <span className="inline-flex items-center gap-1 text-[11px] text-app-muted">
                  <CalendarClock size={12} aria-hidden="true" />
                  {relativeDay(progress.nextReview, today)} · {formatDay(progress.nextReview)}
                </span>
              </>
            ) : (
              <MasteryCounter
                streak={progress?.consecutiveCorrect ?? 0}
                gatePassed={false}
                compact
              />
            )}
            {progress && progress.attempts > 0 && (
              <span className="text-[11px] text-app-muted">
                {progress.correct}/{progress.attempts} correct
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {onPractice && (
              <button
                type="button"
                className="btn-secondary !px-2.5 !py-1.5 text-xs"
                onClick={() => onPractice(concept)}
              >
                <Play size={12} aria-hidden="true" /> Practise
              </button>
            )}
            <button
              type="button"
              className="btn-ghost !px-2.5 !py-1.5 text-xs"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`details-${concept.id}`}
            >
              {open ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
              {open ? 'Hide detail' : 'Details'}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id={`details-${concept.id}`} className="animate-fade-up border-t border-app-border bg-app-raised/50 p-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="label mb-1.5">Key facts</p>
              <ul className="space-y-1.5">
                {concept.keyFacts.map((fact) => (
                  <li key={fact} className="flex gap-2 text-[13px] leading-relaxed text-app-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <div>
                <p className="label mb-1.5">Example</p>
                <p className="text-[13px] leading-relaxed text-app-muted">{concept.example}</p>
              </div>
              <div>
                <p className="label mb-1.5">Explanation</p>
                <p className="text-[13px] leading-relaxed text-app-muted">{concept.explanation}</p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-4">
              <p className="label mb-1.5">Related concepts</p>
              <div className="flex flex-wrap gap-1.5">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/curriculum/week/${rel.week}#${rel.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-app-border bg-app-surface px-2.5 py-1 text-[11px] text-app-muted transition hover:border-brand-500/40 hover:text-app-text"
                  >
                    <Link2 size={10} aria-hidden="true" />
                    {rel.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 rounded-xl border border-app-border bg-app-surface p-3 text-[12px] leading-relaxed text-app-muted">
            <Sparkles size={13} className="mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              <span className="font-medium text-app-text">Hint available in drills: </span>
              {concept.hint}
            </span>
          </p>
        </div>
      )}
    </article>
  )
}

export function WeekStatusPill({ status }: { status: CardStatus }) {
  if (status === 'mastered') return <Badge tone="cyan">Mastered</Badge>
  if (status === 'reviewing') return <Badge tone="brand">In progress</Badge>
  if (status === 'learning') return <Badge tone="amber">Learning</Badge>
  return <Badge tone="muted">Not started</Badge>
}
