/**
 * Five-box Leitner scheduler + three-consecutive-correct mastery gate.
 *
 * This is deliberately NOT SM-2. It is a deterministic, fully frontend
 * scheduler that can be reasoned about (and unit-tested) without any state
 * outside of the `CardProgress` record passed in.
 *
 *   Box 1 → 1 day      Box 2 → 3 days    Box 3 → 7 days
 *   Box 4 → 14 days    Box 5 → 30 days
 *
 * Rules implemented here
 * ----------------------
 * 1. A new card must be answered correctly 3 times *in a row* before it is
 *    scheduled. On clearing the gate it enters Box 1 with a review 1 day out.
 * 2. A correct *scheduled review* advances the card one box and schedules the
 *    next review using the new box's interval.
 * 3. A correct Box 5 review keeps the card in Box 5, 30 days out.
 * 4. An incorrect scheduled review returns the card to Box 1 AND re-opens the
 *    three-correct gate (`nextReview = null`, so it leaves the schedule until
 *    the gate is cleared again).
 * 5. Free practice (`source: 'practice'`) never moves boxes or review dates for
 *    cards that are already scheduled. It can still clear an open gate.
 */

import type {
  AttemptSource,
  CardProgress,
  LeitnerBox,
  RecallMode,
  ReviewEvent,
} from '../types'
import { addDays, type ISODay, toISODay } from '../utils/dates'

export const LEITNER_INTERVALS: Record<LeitnerBox, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
}

export const MASTERY_TARGET = 3

export const BOX_ORDER: LeitnerBox[] = [1, 2, 3, 4, 5]

export const BOX_META: Record<LeitnerBox, { label: string; short: string; color: string }> = {
  1: { label: 'Box 1 · 1 day', short: '1d', color: '#f87171' },
  2: { label: 'Box 2 · 3 days', short: '3d', color: '#fb923c' },
  3: { label: 'Box 3 · 7 days', short: '7d', color: '#fbbf24' },
  4: { label: 'Box 4 · 14 days', short: '14d', color: '#34d399' },
  5: { label: 'Box 5 · 30 days', short: '30d', color: '#22d3ee' },
}

const HISTORY_LIMIT = 40

export function createProgress(id: string): CardProgress {
  return {
    id,
    consecutiveCorrect: 0,
    gatePassed: false,
    box: 0,
    nextReview: null,
    lastAttempt: null,
    gateClearedAt: null,
    attempts: 0,
    correct: 0,
    incorrect: 0,
    history: [],
  }
}

/** The next review day for a box, given the day the review was completed. */
export function nextReviewForBox(box: LeitnerBox, fromDay: ISODay): ISODay {
  return addDays(fromDay, LEITNER_INTERVALS[box])
}

/** Box a card moves to after a correct scheduled review. */
export function advanceBox(box: LeitnerBox | 0): LeitnerBox {
  const base = box === 0 ? 1 : box
  return Math.min(5, base + 1) as LeitnerBox
}

/** Box a failed card returns to. */
export const RESET_BOX: LeitnerBox = 1

export interface AttemptInput {
  correct: boolean
  source: AttemptSource
  mode: RecallMode
  /** Local calendar day of the attempt. */
  today?: ISODay
  /** Full ISO timestamp for history. */
  at?: string
}

export interface AttemptOutcome {
  progress: CardProgress
  /** A scheduled review was completed successfully. */
  advanced: boolean
  /** The review was correct but the card is already in the top box. */
  stayedTop: boolean
  /** A failed scheduled review put the card back in Box 1. */
  reset: boolean
  /** This attempt cleared the three-consecutive-correct gate. */
  gateCleared: boolean
  /** The schedule was deliberately left untouched (free practice). */
  practiceOnly: boolean
}

/**
 * Pure state transition for a single submission. Never mutates the input.
 */
export function applyAttempt(
  current: CardProgress,
  { correct, source, mode, today = toISODay(), at = new Date().toISOString() }: AttemptInput,
): AttemptOutcome {
  const p: CardProgress = {
    ...current,
    history: [...current.history],
  }
  const boxBefore = current.box
  let advanced = false
  let stayedTop = false
  let reset = false
  let gateCleared = false
  let practiceOnly = false

  p.attempts += 1
  p.lastAttempt = at
  if (correct) p.correct += 1
  else p.incorrect += 1

  if (source === 'review') {
    if (correct) {
      const newBox = advanceBox(p.box)
      advanced = true
      stayedTop = newBox === p.box && p.box === 5
      p.box = newBox
      p.gatePassed = true
      p.consecutiveCorrect += 1
      p.nextReview = nextReviewForBox(newBox, today)
      if (!p.gateClearedAt) p.gateClearedAt = at
    } else {
      reset = p.box !== RESET_BOX || p.gatePassed
      p.box = RESET_BOX
      p.gatePassed = false
      p.consecutiveCorrect = 0
      p.nextReview = null // leaves the schedule until the gate is re-cleared
    }
  } else if (source === 'learn' && !p.gatePassed) {
    // Learning drill: build the consecutive-correct streak.
    if (correct) {
      p.consecutiveCorrect += 1
      if (p.consecutiveCorrect >= MASTERY_TARGET) {
        gateCleared = true
        p.gatePassed = true
        p.box = RESET_BOX
        p.nextReview = nextReviewForBox(RESET_BOX, today)
        p.gateClearedAt = at
      }
    } else {
      p.consecutiveCorrect = 0
      p.nextReview = null
      p.box = RESET_BOX
    }
  } else if (source === 'learn') {
    // Learning drill on an already-scheduled card (e.g. "review weak concepts").
    practiceOnly = true
    p.consecutiveCorrect = correct ? p.consecutiveCorrect + 1 : 0
  } else {
    // Free practice.
    if (!p.gatePassed) {
      if (correct) {
        p.consecutiveCorrect += 1
        if (p.consecutiveCorrect >= MASTERY_TARGET) {
          gateCleared = true
          p.gatePassed = true
          p.box = RESET_BOX
          p.nextReview = nextReviewForBox(RESET_BOX, today)
          p.gateClearedAt = at
        }
      } else {
        p.consecutiveCorrect = 0
      }
    } else {
      // Scheduled cards keep their box and review date when practised.
      practiceOnly = true
      p.consecutiveCorrect = correct ? p.consecutiveCorrect + 1 : 0
    }
  }

  const event: ReviewEvent = {
    at,
    correct,
    mode,
    source,
    boxBefore,
    boxAfter: p.box,
    day: today,
  }
  p.history = [event, ...p.history].slice(0, HISTORY_LIMIT)

  return { progress: p, advanced, stayedTop, reset, gateCleared, practiceOnly }
}

/** Effective mastery status of a card, derived (never stored). */
export function cardStatus(p: CardProgress | undefined): 'new' | 'learning' | 'reviewing' | 'mastered' {
  if (!p || p.attempts === 0) return 'new'
  if (!p.gatePassed) return 'learning'
  if (p.box === 5) return 'mastered'
  return 'reviewing'
}

/** Consecutive-correct progress toward the mastery gate (0–3). */
export function gateProgress(p: CardProgress | undefined): number {
  if (!p) return 0
  if (p.gatePassed) return MASTERY_TARGET
  return Math.min(p.consecutiveCorrect, MASTERY_TARGET)
}
