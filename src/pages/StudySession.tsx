import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  BookX,
  Eye,
  Lightbulb,
  LogOut,
  SkipForward,
  Timer,
  X,
} from 'lucide-react'
import { useStudySession } from '../hooks/useStudySession'
import { isPayloadComplete, type AnswerPayload } from '../engine/payload'
import { canonicalAnswer } from '../engine/validation'
import type { SessionConfig } from '../types'
import { RecallDrill } from '../components/drills/RecallDrill'
import { FeedbackPanel } from '../components/FeedbackPanel'
import { MasteryCounter } from '../components/MasteryCounter'
import { SessionSummary } from '../components/SessionSummary'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge, DifficultyBadge, ModeBadge } from '../components/ui/Badge'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { useAppState } from '../context/AppStateContext'
import { getWeek } from '../data/curriculum'
import { LEITNER_INTERVALS } from '../engine/scheduler'
import { formatClock } from '../utils/dates'
import { buildOverview } from '../engine/stats'
import { concepts } from '../data/curriculum'

const SCOPE_LABEL: Record<string, string> = {
  module: 'Module session',
  due: 'Review session',
  practice: 'Free practice',
  weak: 'Weak concepts',
  mistakes: 'Mistake review',
}

function parseConfig(params: URLSearchParams): SessionConfig {
  const scope = (params.get('scope') ?? 'module') as SessionConfig['scope']
  const weekParam = params.get('week')
  const week = weekParam ? Number(weekParam) : undefined
  const type = (params.get('type') ?? (scope === 'due' ? 'review' : scope === 'practice' ? 'practice' : 'learn')) as SessionConfig['type']
  const limit = Math.max(1, Number(params.get('limit') ?? 8) || 8)
  const ids = params.get('ids')?.split(',').filter(Boolean)
  const weekModule = week ? getWeek(week) : undefined
  const label =
    scope === 'module' && weekModule
      ? `Week ${week}: ${weekModule.title}`
      : scope === 'due'
        ? 'Due reviews'
        : ids?.length
          ? 'Mistake review'
          : SCOPE_LABEL[scope] ?? 'Study session'
  return { scope, week, limit, type, label, ids }
}

export default function StudySessionPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { state, today, settings } = useAppState()

  const config = useMemo(() => parseConfig(params), [params])
  // A new query string means a new session: remount the session engine.
  const sessionKey = params.toString()

  return (
    <StudySessionInner
      key={sessionKey}
      config={config}
      onRestart={(next) => setParams(next, { replace: true })}
      overviewGoal={{ done: buildOverview(concepts, state, today).attemptsToday, target: settings.dailyGoal }}
      navigate={navigate}
    />
  )
}

function StudySessionInner({
  config,
  onRestart,
  overviewGoal,
  navigate,
}: {
  config: SessionConfig
  onRestart: (params: URLSearchParams) => void
  overviewGoal: { done: number; target: number }
  navigate: ReturnType<typeof useNavigate>
}) {
  const session = useStudySession(config)
  const { settings } = useAppState()
  const [payload, setPayload] = useState<AnswerPayload>({})
  const [attemptKey, setAttemptKey] = useState(0)
  const [exitOpen, setExitOpen] = useState(false)
  const [goal, setGoal] = useState(overviewGoal)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const { feedback, current, total, index, finished, summary } = session

  // Keep the goal strip live as submissions land.
  useEffect(() => {
    setGoal(overviewGoal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewGoal.done, overviewGoal.target])

  const submit = useCallback(() => {
    if (session.feedback || !session.current) return
    if (!isPayloadComplete(session.current, payload)) return
    const result = session.submit(payload)
    if (result) window.setTimeout(() => nextButtonRef.current?.focus(), 40)
  }, [payload, session])

  const reveal = useCallback(() => {
    if (session.feedback) return
    const result = session.submit(payload, { forceIncorrect: true })
    if (result) window.setTimeout(() => nextButtonRef.current?.focus(), 40)
  }, [payload, session])

  const advance = useCallback(() => {
    setPayload({})
    setAttemptKey((k) => k + 1)
    session.advance()
  }, [session])

  // Escape exits after confirmation; Enter continues when feedback is showing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setExitOpen(true)
      }
      if (event.key === 'Enter' && session.feedback && !exitOpen) {
        const target = event.target as HTMLElement
        if (target.tagName === 'BUTTON' || target.tagName === 'TEXTAREA') return
        event.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advance, exitOpen, session.feedback])

  if (session.empty) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <EmptyState
          icon={BookX}
          title="Nothing to study here yet"
          description={
            config.scope === 'due'
              ? 'No cards are scheduled for review today. Learn new concepts to start building the schedule.'
              : 'This session has no cards matching your preferences. Try a different module or enable more recall modes in Settings.'
          }
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className="btn-primary" onClick={() => navigate('/curriculum')}>
                Browse curriculum
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                Dashboard
              </button>
            </div>
          }
        />
      </div>
    )
  }

  if (finished && summary) {
    const mistakes = summary.mistakeIds
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <SessionSummary
          summary={summary}
          goal={{ done: goal.done, target: goal.target }}
          hasMistakes={mistakes.length > 0}
          onContinue={() => navigate('/learn')}
          onDashboard={() => navigate('/')}
          onReviewMistakes={() => {
            const params = new URLSearchParams({
              scope: 'mistakes',
              type: 'practice',
              limit: String(Math.max(4, mistakes.length)),
              ids: mistakes.join(','),
              week: String(config.week ?? ''),
            })
            if (!config.week) params.delete('week')
            onRestart(params)
          }}
        />
      </div>
    )
  }

  if (!current) return null

  const weekModule = getWeek(current.week)
  const progressPercent = Math.round(((index + (feedback?.completed ? 1 : 0)) / total) * 100)
  const canSubmit = isPayloadComplete(current, payload) && !feedback

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="sticky top-0 z-20 border-b border-app-border bg-app-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setExitOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-app-muted transition hover:bg-app-raised hover:text-app-text"
          >
            <X size={15} aria-hidden="true" /> Exit
          </button>

          <div className="flex min-w-0 items-center gap-2 text-[11px] text-app-muted">
            <span className="hidden sm:inline">Week {current.week}</span>
            <span className="hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="truncate">{weekModule?.title ?? 'Data Science'}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-app-muted">
            <span className="inline-flex items-center gap-1 tabular-nums" aria-label="Session time">
              <Timer size={13} aria-hidden="true" />
              {formatClock(session.elapsedMs)}
            </span>
            <Badge tone={config.type === 'review' ? 'amber' : config.type === 'practice' ? 'violet' : 'brand'}>
              {config.type === 'review' ? 'Review' : config.type === 'practice' ? 'Practice' : 'Learning'}
            </Badge>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <ProgressBar
            value={progressPercent}
            label={`Session progress: card ${index + 1} of ${total}`}
            height="sm"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-app-muted">
            <span>
              Card {index + 1} of {total}
            </span>
            <span aria-hidden="true">·</span>
            <span className="normal-case tracking-normal text-app-muted">{current.topic}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DifficultyBadge difficulty={current.difficulty} />
            <ModeBadge mode={current.drill.mode} />
          </div>
        </div>

        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-400">
                Recall prompt
              </p>
              <h1 className="mt-1.5 text-lg font-semibold leading-snug sm:text-xl">
                {current.drill.prompt}
              </h1>
            </div>
            <div className="shrink-0">
              <MasteryCounter
                streak={session.streak}
                gatePassed={Boolean(session.progress?.gatePassed)}
                required={session.requiredCorrect}
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-app-border bg-app-raised/60 p-4">
            {session.revealed && !feedback && (
              <p className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-700 dark:text-amber-200">
                Answer: <strong>{canonicalAnswer(current.drill)}</strong> — revealing counts as an
                incorrect attempt, so submit to continue and reset the counter.
              </p>
            )}
            <RecallDrill
              key={`${current.id}-${attemptKey}`}
              concept={current}
              payload={payload}
              onChange={setPayload}
              onSubmit={submit}
              disabled={Boolean(feedback)}
              feedback={feedback}
              revealed={session.revealed}
            />
          </div>

          {session.showHint && !feedback && (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-3 py-2.5 text-xs leading-relaxed text-amber-200">
              <Lightbulb size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{current.hint}</span>
            </p>
          )}

          {!feedback && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="btn-primary" onClick={submit} disabled={!canSubmit}>
                Submit answer
                <span className="ml-1 hidden rounded border border-ink-950/20 px-1 text-[10px] font-medium sm:inline">
                  Enter
                </span>
              </button>
              <button type="button" className="btn-secondary" onClick={session.toggleHint}>
                <Lightbulb size={14} aria-hidden="true" /> {session.showHint ? 'Hide hint' : 'Hint'}
              </button>
              {settings.allowReveal && (
                <button type="button" className="btn-ghost" onClick={reveal} title="Revealing counts as an incorrect attempt">
                  <Eye size={14} aria-hidden="true" /> Reveal
                </button>
              )}
              <button type="button" className="btn-ghost ml-auto" onClick={session.skip}>
                <SkipForward size={14} aria-hidden="true" /> Skip
              </button>
            </div>
          )}
        </section>

        {feedback && (
          <div className="mt-4">
            <FeedbackPanel
              feedback={feedback}
              concept={current}
              hintOpen={session.showHint}
              onToggleHint={session.toggleHint}
              actions={
                <>
                  <button
                    ref={nextButtonRef}
                    type="button"
                    className="btn-primary"
                    onClick={advance}
                  >
                    {feedback.completed
                      ? index + 1 >= total
                        ? 'Finish session'
                        : 'Next card'
                      : 'Try again'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                  {!feedback.completed && (
                    <span className="text-[11px] text-app-muted">
                      The counter resets on a miss — three in a row are required.
                    </span>
                  )}
                  {feedback.completed && (
                    <span className="text-[11px] text-app-muted">
                      {feedback.gateCleared
                        ? 'Scheduled in Box 1 · next review in 1 day.'
                        : feedback.advanced
                          ? feedback.stayedTop
                            ? `Stayed in Box 5 · next review in ${LEITNER_INTERVALS[5]} days.`
                            : `Advanced to Box ${session.progress?.box ?? 1} · next review in ${LEITNER_INTERVALS[(session.progress?.box ?? 1) as 1 | 2 | 3 | 4 | 5]} days.`
                          : 'Card recalled correctly — its review schedule is unchanged.'}
                    </span>
                  )}
                </>
              }
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] text-app-muted">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-app-border bg-app-surface px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>
            submit / continue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-app-border bg-app-surface px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
            exit session
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LogOut size={12} aria-hidden="true" /> Progress saves automatically
          </span>
        </div>
      </div>

      <ConfirmDialog
        open={exitOpen}
        title="Exit this session?"
        description="Your answered cards keep their progress, and this session will be saved. Unanswered cards stay in the queue."
        confirmLabel="Exit session"
        cancelLabel="Keep studying"
        tone="danger"
        onConfirm={() => {
          setExitOpen(false)
          session.exit()
          navigate(config.week ? `/curriculum/week/${config.week}` : '/')
        }}
        onCancel={() => setExitOpen(false)}
      />
      <span className="sr-only" aria-live="polite">
        Week {current.week}, card {index + 1} of {total}. Consecutive correct answers so far:{' '}
        {session.streak}. {feedback ? (feedback.correct ? 'Correct answer.' : 'Incorrect answer.') : ''}
      </span>
    </div>
  )
}
