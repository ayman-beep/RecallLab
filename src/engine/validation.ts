/**
 * Deterministic, frontend-only answer validation.
 *
 * Rules (documented for the learner in Settings):
 *  1. Leading and trailing whitespace is ignored.
 *  2. Comparison is case-insensitive.
 *  3. Runs of internal whitespace are collapsed to a single space.
 *  4. A single trailing sentence punctuation mark is ignored.
 *  5. Explicitly configured accepted variants are supported.
 *  6. NO fuzzy / edit-distance matching — a near-miss is a miss.
 */

import type {
  CategorizeAssignDrill,
  CategorizeDrill,
  CategorizeMultiDrill,
  ClozeDrill,
  Drill,
  ShortAnswerDrill,
} from '../types'

const DASHES = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g
const QUOTES = /[\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F]/g

/**
 * Canonical normalisation used for *both* the learner's input and the stored
 * accepted answers. Exported so the behaviour can be unit-tested in isolation.
 */
export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFKC')
    .replace(DASHES, '-')
    .replace(QUOTES, "'")
    .replace(/\u00a0/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.!?;:,]+$/u, '')
    .trim()
    .toLowerCase()
}

/** True when the learner's text exactly matches one of the accepted answers. */
export function isAnswerAccepted(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(input)
  if (!normalized) return false
  return accepted.some((answer) => normalizeAnswer(answer) === normalized)
}

/* ------------------------------------------------------------------ */
/* Cloze                                                               */
/* ------------------------------------------------------------------ */

export interface ClozeResult {
  correct: boolean
  /** Per-blank verdict, in template order. */
  perBlank: boolean[]
  /** 1-based indexes of blanks that were wrong or empty. */
  wrongBlanks: number[]
}

export function validateCloze(
  inputs: string[],
  drill: Pick<ClozeDrill, 'blanks'>,
): ClozeResult {
  const perBlank = drill.blanks.map((blank, i) =>
    isAnswerAccepted(inputs[i] ?? '', blank.answers),
  )
  const wrongBlanks = perBlank
    .map((ok, i) => (ok ? -1 : i + 1))
    .filter((n) => n > 0)
  return { correct: wrongBlanks.length === 0, perBlank, wrongBlanks }
}

/* ------------------------------------------------------------------ */
/* Categorization                                                      */
/* ------------------------------------------------------------------ */

export interface AssignResult {
  correct: boolean
  /** Ids of items placed in the wrong category (or left blank). */
  wrongItemIds: string[]
  /** Item id → whether the placement was right. */
  perItem: Record<string, boolean>
}

export function validateAssignment(
  drill: CategorizeAssignDrill,
  assignments: Record<string, string | null | undefined>,
): AssignResult {
  const perItem: Record<string, boolean> = {}
  const wrongItemIds: string[] = []
  for (const item of drill.items) {
    const ok = assignments[item.id] === item.categoryId
    perItem[item.id] = ok
    if (!ok) wrongItemIds.push(item.id)
  }
  return { correct: wrongItemIds.length === 0, wrongItemIds, perItem }
}

export interface MultiResult {
  correct: boolean
  missedIds: string[]
  falsePositiveIds: string[]
}

export function validateMulti(
  drill: CategorizeMultiDrill,
  selectedIds: string[],
): MultiResult {
  const selected = new Set(selectedIds)
  const correctIds = drill.options.filter((o) => o.correct).map((o) => o.id)
  const missedIds = correctIds.filter((id) => !selected.has(id))
  const falsePositiveIds = drill.options
    .filter((o) => !o.correct && selected.has(o.id))
    .map((o) => o.id)
  return {
    correct: missedIds.length === 0 && falsePositiveIds.length === 0,
    missedIds,
    falsePositiveIds,
  }
}

export interface GradeResult {
  correct: boolean
  /** Canonical text of the expected answer, for feedback. */
  expected: string
  /** Extra detail: which blanks / items were wrong. */
  detail?: string
  cloze?: ClozeResult
  assign?: AssignResult
  multi?: MultiResult
}

/** Grade any drill given the learner's raw answer payload. */
export function gradeDrill(
  drill: Drill,
  payload: {
    text?: string
    blanks?: string[]
    assignments?: Record<string, string | null>
    multi?: string[]
  },
): GradeResult {
  if (drill.mode === 'short') {
    const correct = isAnswerAccepted(payload.text ?? '', drill.answers)
    return { correct, expected: drill.answers[0] }
  }

  if (drill.mode === 'cloze') {
    const result = validateCloze(payload.blanks ?? [], drill)
    return {
      correct: result.correct,
      expected: drill.blanks.map((b) => b.answers[0]).join(' · '),
      detail: result.correct
        ? undefined
        : `Incorrect blank${result.wrongBlanks.length > 1 ? 's' : ''}: ${result.wrongBlanks.join(', ')}`,
      cloze: result,
    }
  }

  if (drill.variant === 'assign') {
    const result = validateAssignment(drill, payload.assignments ?? {})
    return {
      correct: result.correct,
      expected: drill.items
        .map((item) => {
          const cat = drill.categories.find((c) => c.id === item.categoryId)
          return `${item.label} → ${cat?.label ?? item.categoryId}`
        })
        .join(' · '),
      detail: result.correct
        ? undefined
        : `${result.wrongItemIds.length} of ${drill.items.length} placements were incorrect.`,
      assign: result,
    }
  }

  const result = validateMulti(drill, payload.multi ?? [])
  return {
    correct: result.correct,
    expected: drill.options
      .filter((o) => o.correct)
      .map((o) => o.label)
      .join(' · '),
    detail: result.correct
      ? undefined
      : [
          result.missedIds.length ? `${result.missedIds.length} missing` : '',
          result.falsePositiveIds.length
            ? `${result.falsePositiveIds.length} incorrectly selected`
            : '',
        ]
          .filter(Boolean)
          .join(', '),
    multi: result,
  }
}

/** Human-readable canonical answer for reveal/feedback panels. */
export function canonicalAnswer(drill: Drill): string {
  if (drill.mode === 'short') return drill.answers[0]
  if (drill.mode === 'cloze') return drill.blanks.map((b) => b.answers[0]).join(' · ')
  if (drill.variant === 'assign') {
    return drill.items
      .map((item) => {
        const cat = drill.categories.find((c) => c.id === item.categoryId)
        return `${item.label} → ${cat?.label ?? item.categoryId}`
      })
      .join(' · ')
  }
  return drill.options
    .filter((o) => o.correct)
    .map((o) => o.label)
    .join(' · ')
}

/** Explicit accepted variants, for the "also accepted" line in feedback. */
export function acceptedVariants(drill: Drill): string[] {
  if (drill.mode === 'short') return drill.answers.slice(1)
  if (drill.mode === 'cloze') return drill.blanks.flatMap((b) => b.answers.slice(1))
  return []
}

export type { ShortAnswerDrill, ClozeDrill, CategorizeDrill }
