import type { ReactNode } from 'react'
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import type { SessionFeedback } from '../hooks/useStudySession'
import type { Concept } from '../types'

interface FeedbackPanelProps {
  feedback: SessionFeedback
  concept: Concept
  onToggleHint: () => void
  hintOpen: boolean
  actions: ReactNode
}

export function FeedbackPanel({
  feedback,
  concept,
  onToggleHint,
  hintOpen,
  actions,
}: FeedbackPanelProps) {
  const correct = feedback.correct
  return (
    <section
      role="status"
      aria-live="assertive"
      className={`animate-pop-in rounded-2xl border p-4 sm:p-5 ${
        correct
          ? 'border-brand-500/35 bg-brand-500/[0.07]'
          : 'border-red-500/35 bg-red-500/[0.07]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${
            correct
              ? 'border-brand-500/40 bg-brand-500/15 text-brand-300'
              : 'border-red-500/40 bg-red-500/15 text-red-300'
          }`}
        >
          {correct ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${correct ? 'text-brand-300' : 'text-red-300'}`}>
            {correct ? 'Correct' : 'Not quite'}
            {correct && feedback.gateCleared ? ' — mastery gate cleared' : ''}
            {correct && feedback.advanced && !feedback.stayedTop ? ' — review advanced' : ''}
            {correct && feedback.stayedTop ? ' — review completed in Box 5' : ''}
          </p>

          {!correct && (
            <div className="mt-2 space-y-2 text-sm">
              <p className="text-app-text">
                <span className="text-app-muted">Correct answer: </span>
                <strong className="font-semibold">{feedback.expected}</strong>
              </p>
              {feedback.detail && <p className="text-xs text-red-300">{feedback.detail}</p>}
              {feedback.variants.length > 0 && (
                <p className="text-xs text-app-muted">
                  Also accepted: {feedback.variants.join(' · ')}
                </p>
              )}
            </div>
          )}

          {correct && feedback.variants.length > 0 && (
            <p className="mt-1 text-xs text-app-muted">
              Accepted variants: {feedback.variants.join(' · ')}
            </p>
          )}

          <p className="mt-2 text-sm leading-relaxed text-app-muted">
            <span className="font-medium text-app-text/90">Why: </span>
            {concept.explanation}
          </p>

          {!correct && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onToggleHint}
                className="inline-flex items-center gap-1.5 rounded-lg border border-app-border bg-app-surface px-2.5 py-1.5 text-xs font-medium text-app-muted transition hover:text-app-text"
                aria-expanded={hintOpen}
              >
                <Lightbulb size={13} aria-hidden="true" />
                {hintOpen ? 'Hide hint' : 'Show hint'}
              </button>
              {hintOpen && (
                <p className="mt-2 flex gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-3 py-2 text-xs leading-relaxed text-amber-200">
                  <Lightbulb size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{concept.hint}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>
        </div>
      </div>
    </section>
  )
}
