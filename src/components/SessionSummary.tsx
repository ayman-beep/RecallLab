import { ArrowRight, CheckCircle2, Clock, Repeat, RotateCcw, Target, TrendingUp } from 'lucide-react'
import type { SessionSummary as Summary } from '../hooks/useStudySession'
import { formatDuration } from '../utils/dates'
import { ProgressBar } from './ui/ProgressBar'

interface Props {
  summary: Summary
  goal: { done: number; target: number }
  onContinue: () => void
  onReviewMistakes: () => void
  onDashboard: () => void
  hasMistakes: boolean
}

export function SessionSummary({ summary, goal, onContinue, onReviewMistakes, onDashboard, hasMistakes }: Props) {
  const accuracy = summary.submissions
    ? Math.round((summary.correct / summary.submissions) * 100)
    : 0
  const goalPercent = Math.min(100, Math.round((goal.done / Math.max(1, goal.target)) * 100))
  const rows = [
    { label: 'Cards attempted', value: summary.cardsPresented, icon: Target },
    { label: 'Correct submissions', value: summary.correct, icon: CheckCircle2 },
    { label: 'Incorrect submissions', value: summary.incorrect, icon: RotateCcw },
    { label: 'Concepts mastered', value: summary.conceptsMastered, icon: TrendingUp },
    { label: 'Reviews advanced', value: summary.reviewsAdvanced, icon: Repeat },
    { label: 'Cards reset to Box 1', value: summary.cardsReset, icon: RotateCcw },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up">
      <div className="card overflow-hidden">
        <div className="border-b border-app-border bg-brand-500/[0.06] p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300">
            Session complete
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{summary.label}</h2>
          <p className="mt-1 text-sm text-app-muted">
            {summary.submissions} submission{summary.submissions === 1 ? '' : 's'} · {accuracy}% correct ·{' '}
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden="true" /> {formatDuration(summary.durationMs)}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-app-border sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.label} className="bg-app-surface p-4">
              <div className="flex items-center gap-1.5 text-app-muted">
                <row.icon size={13} aria-hidden="true" />
                <span className="text-[11px] font-medium uppercase tracking-wide">{row.label}</span>
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{row.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-app-border p-6">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-app-muted">Daily goal</span>
            <span className="font-medium tabular-nums">
              {goal.done} / {goal.target} submissions
            </span>
          </div>
          <ProgressBar value={goalPercent} label="Daily goal progress" height="md" />
          <p className="mt-2 text-[11px] text-app-muted">
            {goal.done >= goal.target
              ? 'Goal reached — extra repetitions only make the cards stronger.'
              : `${goal.target - goal.done} more submissions to reach today's goal.`}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-app-border p-4 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={onDashboard}>
            Back to dashboard
          </button>
          {hasMistakes && (
            <button type="button" className="btn-secondary" onClick={onReviewMistakes}>
              <RotateCcw size={14} aria-hidden="true" /> Review mistakes
            </button>
          )}
          <button type="button" className="btn-primary" onClick={onContinue}>
            Continue studying <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
