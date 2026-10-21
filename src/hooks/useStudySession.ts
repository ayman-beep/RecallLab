import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AttemptSource, Concept, SessionConfig } from '../types'
import { concepts as allConcepts } from '../data/curriculum'
import { useAppState } from '../context/AppStateContext'
import {
  acceptedVariants,
  gradeDrill,
  type AssignResult,
  type ClozeResult,
  type MultiResult,
} from '../engine/validation'
import { buildQueue } from '../engine/queue'
import { MASTERY_TARGET } from '../engine/scheduler'
import type { AnswerPayload } from '../engine/payload'

export interface SessionFeedback {
  correct: boolean
  mode: 'short' | 'cloze' | 'categorize'
  expected: string
  detail?: string
  variants: string[]
  cloze?: ClozeResult
  assign?: AssignResult
  multi?: MultiResult
  /** The card finished in this session (gate cleared / review advanced). */
  completed: boolean
  gateCleared: boolean
  advanced: boolean
  stayedTop: boolean
  reset: boolean
  /** Consecutive-correct count after this attempt. */
  streak: number
}

export interface SessionStats {
  submissions: number
  correct: number
  incorrect: number
  conceptsMastered: number
  reviewsAdvanced: number
  cardsReset: number
  completedIds: string[]
  presentedIds: string[]
  /** Cards that received at least one submission (skipped cards excluded). */
  attemptedIds: string[]
  mistakeIds: string[]
}

export interface SessionSummary {
  label: string
  type: SessionConfig['type']
  cardsPresented: number
  cardsCompleted: number
  submissions: number
  correct: number
  incorrect: number
  conceptsMastered: number
  reviewsAdvanced: number
  cardsReset: number
  durationMs: number
  finishedAt: string
  mistakeIds: string[]
}

const emptyStats = (): SessionStats => ({
  submissions: 0,
  correct: 0,
  incorrect: 0,
  conceptsMastered: 0,
  reviewsAdvanced: 0,
  cardsReset: 0,
  completedIds: [],
  presentedIds: [],
  attemptedIds: [],
  mistakeIds: [],
})

export function useStudySession(config: SessionConfig) {
  const { cards, recordAttempt, recordSession, play, settings } = useAppState()

  const [queue] = useState<Concept[]>(() => {
    const built = buildQueue(config, allConcepts, cards)
    const preferred = built.filter((c) => settings.preferredModes.includes(c.drill.mode))
    // Never let a preference filter produce an empty session.
    return preferred.length > 0 ? preferred : built
  })

  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(queue.length === 0)
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [stats, setStats] = useState<SessionStats>(emptyStats)

  const statsRef = useRef<SessionStats>(emptyStats())
  const indexRef = useRef(0)
  const lockRef = useRef(false)
  const [startedAt] = useState(() => Date.now())
  const finishedRef = useRef(queue.length === 0)
  const feedbackRef = useRef<SessionFeedback | null>(null)

  const current = queue[index]
  const progress = current ? cards[current.id] : undefined

  /** Correct answers still required for this card in this session. */
  const requiredCorrect = useMemo(() => {
    if (!current) return 0
    if (!progress || !progress.gatePassed) {
      return Math.max(1, MASTERY_TARGET - (progress?.consecutiveCorrect ?? 0))
    }
    return 1
  }, [current, progress])

  // Live timer.
  useEffect(() => {
    if (finished) return
    const timer = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt)
    }, 500)
    return () => window.clearInterval(timer)
  }, [finished])

  const sourceFor = useCallback(
    (conceptId: string): AttemptSource => {
      const card = cards[conceptId]
      if (!card?.gatePassed) return 'learn'
      if (config.type === 'review') return 'review'
      if (config.type === 'practice') return 'practice'
      return 'learn'
    },
    [cards, config.type],
  )

  const finalize = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    const s = statsRef.current
    const durationMs = Date.now() - startedAt
    const result: SessionSummary = {
      label: config.label,
      type: config.type,
      cardsPresented: s.attemptedIds.length,
      cardsCompleted: s.completedIds.length,
      submissions: s.submissions,
      correct: s.correct,
      incorrect: s.incorrect,
      conceptsMastered: s.conceptsMastered,
      reviewsAdvanced: s.reviewsAdvanced,
      cardsReset: s.cardsReset,
      durationMs,
      finishedAt: new Date().toISOString(),
      mistakeIds: s.mistakeIds,
    }
    setSummary(result)
    setFinished(true)
    setFeedback(null)
    feedbackRef.current = null
    if (s.submissions > 0) {
      recordSession({
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date().toISOString(),
        type: config.type,
        label: config.label,
        submissions: s.submissions,
        correct: s.correct,
        incorrect: s.incorrect,
        conceptsMastered: s.conceptsMastered,
        reviewsAdvanced: s.reviewsAdvanced,
        cardsReset: s.cardsReset,
        durationMs,
      })
      play('complete')
    }
  }, [config.label, config.type, play, recordSession])

  const submit = useCallback(
    (payload: AnswerPayload, options?: { forceIncorrect?: boolean }): SessionFeedback | null => {
      if (!current || lockRef.current || feedbackRef.current) return null
      lockRef.current = true
      const drill = current.drill
      const graded = gradeDrill(drill, payload)
      // Revealing the answer always counts as a miss, even if the typed text
      // happened to be right, so the reveal button can never skip the gate.
      const result = options?.forceIncorrect
        ? { ...graded, correct: false, detail: 'Answer revealed — counted as a miss.' }
        : graded
      const source = sourceFor(current.id)
      const outcome = recordAttempt(current.id, result.correct, source, drill.mode)

      const advanced = outcome.advanced
      const reset = outcome.reset
      const gateCleared = outcome.gateCleared

      // A card is finished for this session once it is scheduled again: either
      // the gate was just cleared, or it was recalled correctly from a box.
      const completed = result.correct && outcome.progress.gatePassed

      const fb: SessionFeedback = {
        correct: result.correct,
        mode: drill.mode,
        expected: result.expected,
        detail: result.detail,
        variants: acceptedVariants(drill),
        cloze: result.cloze,
        assign: result.assign,
        multi: result.multi,
        completed,
        gateCleared,
        advanced,
        stayedTop: outcome.stayedTop,
        reset,
        streak: outcome.progress.consecutiveCorrect,
      }

      const nextStats: SessionStats = {
        submissions: statsRef.current.submissions + 1,
        correct: statsRef.current.correct + (result.correct ? 1 : 0),
        incorrect: statsRef.current.incorrect + (result.correct ? 0 : 1),
        conceptsMastered: statsRef.current.conceptsMastered + (gateCleared ? 1 : 0),
        reviewsAdvanced:
          statsRef.current.reviewsAdvanced + (advanced && config.type === 'review' ? 1 : 0),
        cardsReset: statsRef.current.cardsReset + (reset ? 1 : 0),
        completedIds:
          completed && !statsRef.current.completedIds.includes(current.id)
            ? [...statsRef.current.completedIds, current.id]
            : statsRef.current.completedIds,
        presentedIds: statsRef.current.presentedIds,
        attemptedIds: statsRef.current.attemptedIds.includes(current.id)
          ? statsRef.current.attemptedIds
          : [...statsRef.current.attemptedIds, current.id],
        mistakeIds:
          !result.correct && !statsRef.current.mistakeIds.includes(current.id)
            ? [...statsRef.current.mistakeIds, current.id]
            : statsRef.current.mistakeIds,
      }
      statsRef.current = nextStats
      setStats(nextStats)
      feedbackRef.current = fb
      setFeedback(fb)
      play(result.correct ? (gateCleared ? 'mastered' : 'success') : 'error')
      return fb
    },
    [config.type, current, play, recordAttempt, sourceFor],
  )

  const advance = useCallback(() => {
    const lastFeedback = feedbackRef.current
    lockRef.current = false
    feedbackRef.current = null
    setFeedback(null)
    setShowHint(false)
    setRevealed(false)

    // Not yet mastered: repeat the same card instead of moving on.
    if (lastFeedback && !lastFeedback.completed) return

    const nextIndex = indexRef.current + 1
    if (nextIndex >= queue.length) {
      finalize()
      return
    }

    indexRef.current = nextIndex
    setIndex(nextIndex)

    const presented = queue[nextIndex]
    if (presented && !statsRef.current.presentedIds.includes(presented.id)) {
      const nextStats = {
        ...statsRef.current,
        presentedIds: [...statsRef.current.presentedIds, presented.id],
      }
      statsRef.current = nextStats
      setStats(nextStats)
    }
  }, [finalize, queue])

  const skip = useCallback(() => {
    advance()
  }, [advance])

  // Register the first presented card.
  useEffect(() => {
    if (!current) return
    if (!statsRef.current.presentedIds.includes(current.id)) {
      const nextStats = {
        ...statsRef.current,
        presentedIds: [...statsRef.current.presentedIds, current.id],
      }
      statsRef.current = nextStats
      setStats(nextStats)
    }
  }, [current])

  const exit = useCallback(() => {
    finalize()
  }, [finalize])

  const reveal = useCallback(() => {
    setRevealed(true)
    if (current) play('click')
  }, [current, play])

  return {
    config,
    queue,
    total: queue.length,
    index,
    current,
    progress,
    requiredCorrect,
    streak: progress?.consecutiveCorrect ?? 0,
    feedback,
    showHint,
    toggleHint: () => setShowHint((v) => !v),
    revealed,
    reveal,
    submit,
    advance,
    skip,
    exit,
    finished,
    summary,
    elapsedMs,
    stats,
    startedAt,
    empty: queue.length === 0,
  }
}

export type StudySession = ReturnType<typeof useStudySession>
