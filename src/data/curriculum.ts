/**
 * Curriculum registry.
 *
 * Adding a card is a pure data change: append a `Concept` to the relevant week
 * file. Nothing in the UI needs to know about it.
 */

import type { Concept, RecallMode, WeekModule } from '../types'
import { concepts as w1, week as week1 } from './weeks/week01'
import { concepts as w2, week as week2 } from './weeks/week02'
import { concepts as w3, week as week3 } from './weeks/week03'
import { concepts as w4, week as week4 } from './weeks/week04'
import { concepts as w5, week as week5 } from './weeks/week05'
import { concepts as w6, week as week6 } from './weeks/week06'
import { concepts as w7, week as week7 } from './weeks/week07'
import { concepts as w8, week as week8 } from './weeks/week08'
import { concepts as w9, week as week9 } from './weeks/week09'
import { concepts as w10, week as week10 } from './weeks/week10'
import { concepts as w11, week as week11 } from './weeks/week11'
import { concepts as w12, week as week12 } from './weeks/week12'
import { concepts as w13, week as week13 } from './weeks/week13'
import { concepts as w14, week as week14 } from './weeks/week14'

export const weeks: WeekModule[] = [
  week1,
  week2,
  week3,
  week4,
  week5,
  week6,
  week7,
  week8,
  week9,
  week10,
  week11,
  week12,
  week13,
  week14,
]

const rawConcepts: Concept[] = [
  ...w1,
  ...w2,
  ...w3,
  ...w4,
  ...w5,
  ...w6,
  ...w7,
  ...w8,
  ...w9,
  ...w10,
  ...w11,
  ...w12,
  ...w13,
  ...w14,
]

const knownIds = new Set(rawConcepts.map((c) => c.id))

/** Related ids are filtered so a typo can never break navigation. */
export const concepts: Concept[] = rawConcepts.map((concept) => ({
  ...concept,
  related: concept.related.filter((id) => knownIds.has(id) && id !== concept.id),
}))

export const conceptById = new Map(concepts.map((c) => [c.id, c]))
export const weekByNumber = new Map(weeks.map((w) => [w.week, w]))

export const conceptsByWeek = new Map<number, Concept[]>(
  weeks.map((w) => [w.week, concepts.filter((c) => c.week === w.week)]),
)

export function getWeek(week: number): WeekModule | undefined {
  return weekByNumber.get(week)
}

export function getConcept(id: string): Concept | undefined {
  return conceptById.get(id)
}

export function getConceptsForWeek(week: number): Concept[] {
  return conceptsByWeek.get(week) ?? []
}

export function getRelatedConcepts(concept: Concept): Concept[] {
  return concept.related
    .map((id) => conceptById.get(id))
    .filter((c): c is Concept => Boolean(c))
}

export function searchConcepts(query: string): Concept[] {
  const q = query.trim().toLowerCase()
  if (!q) return concepts
  return concepts.filter((c) =>
    [c.title, c.topic, c.definition, c.keyFacts.join(' '), c.example]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

export function modesForWeek(week: number): RecallMode[] {
  return [...new Set(getConceptsForWeek(week).map((c) => c.drill.mode))]
}

export const curriculumMeta = {
  weekCount: weeks.length,
  conceptCount: concepts.length,
  totalMinutes: weeks.reduce((sum, w) => sum + w.estimatedMinutes, 0),
  modes: {
    short: concepts.filter((c) => c.drill.mode === 'short').length,
    cloze: concepts.filter((c) => c.drill.mode === 'cloze').length,
    categorize: concepts.filter((c) => c.drill.mode === 'categorize').length,
  },
}

/** Dev-time integrity check (silent in production). */
const DEV = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV)
if (DEV) {
  const ids = new Set<string>()
  for (const concept of rawConcepts) {
    if (ids.has(concept.id)) {
      console.warn(`[curriculum] duplicate concept id: ${concept.id}`)
    }
    ids.add(concept.id)
    if (!concept.week || concept.week < 1 || concept.week > weeks.length) {
      console.warn(`[curriculum] bad week on ${concept.id}`)
    }
    if (concept.drill.mode === 'cloze') {
      const blanks = (concept.drill.template.match(/___/g) ?? []).length
      if (blanks !== concept.drill.blanks.length) {
        console.warn(
          `[curriculum] cloze blank mismatch on ${concept.id}: ${blanks} placeholders vs ${concept.drill.blanks.length} answers`,
        )
      }
    }
  }
}
