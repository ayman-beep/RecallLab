import type { Concept } from '../types'

export interface AnswerPayload {
  text?: string
  blanks?: string[]
  assignments?: Record<string, string | null>
  multi?: string[]
}

/** Is the learner's current payload complete enough to submit? */
export function isPayloadComplete(concept: Concept, payload: AnswerPayload): boolean {
  const drill = concept.drill
  if (drill.mode === 'short') return Boolean(payload.text?.trim())
  if (drill.mode === 'cloze') {
    const values = payload.blanks ?? []
    return drill.blanks.every((_, i) => Boolean(values[i]?.trim()))
  }
  if (drill.variant === 'assign') {
    const assignments = payload.assignments ?? {}
    return drill.items.every((item) => Boolean(assignments[item.id]))
  }
  return (payload.multi?.length ?? 0) > 0
}
