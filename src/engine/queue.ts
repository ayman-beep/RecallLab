import type { CardProgress, Concept, SessionConfig } from '../types'
import { dueCards, gateOpenCards, mostMissed } from './stats'
import { toISODay, type ISODay } from '../utils/dates'

export function shuffle<T>(items: T[], seed = Date.now()): T[] {
  const arr = [...items]
  let random = seed % 2_147_483_647
  const next = () => {
    random = (random * 48_271) % 2_147_483_647
    return random / 2_147_483_647
  }
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Learning sessions present the least-known cards first, in curriculum order. */
function orderForLearning(concepts: Concept[], cards: Record<string, CardProgress>): Concept[] {
  const rank = (c: Concept) => {
    const p = cards[c.id]
    if (!p || p.attempts === 0) return 0
    if (!p.gatePassed) return 1
    return 2
  }
  return [...concepts].sort((a, b) => rank(a) - rank(b) || a.week - b.week)
}

/**
 * Build the ordered card queue for a session.
 *
 * - `module`   learn/practise the concepts of one week
 * - `due`      scheduled cards whose review day has arrived (most overdue first)
 * - `practice` unscheduled free practice, never moves review dates
 * - `weak`     attempted cards with the lowest accuracy / open gates
 * - `mistakes` the explicit id list passed in (e.g. "review my mistakes")
 */
export function buildQueue(
  config: SessionConfig,
  allConcepts: Concept[],
  cards: Record<string, CardProgress>,
  today: ISODay = toISODay(),
): Concept[] {
  const pool =
    config.week !== undefined ? allConcepts.filter((c) => c.week === config.week) : allConcepts

  switch (config.scope) {
    case 'due':
      return dueCards(pool, cards, today)
        .map((row) => row.concept)
        .slice(0, config.limit)

    case 'mistakes': {
      const ids = new Set(config.ids ?? [])
      return orderForLearning(
        pool.filter((c) => ids.has(c.id)),
        cards,
      ).slice(0, config.limit)
    }

    case 'weak': {
      const missed = mostMissed(pool, cards, pool.length).map((m) => m.concept)
      const openGates = gateOpenCards(pool, cards)
        .filter((row) => (row.progress?.attempts ?? 0) > 0)
        .map((row) => row.concept)
      const merged = [...openGates, ...missed]
      const unique = [...new Map(merged.map((c) => [c.id, c])).values()]
      if (unique.length === 0) {
        return orderForLearning(pool, cards).slice(0, config.limit)
      }
      return unique.slice(0, config.limit)
    }

    case 'practice': {
      const unscheduled = orderForLearning(pool, cards)
      return shuffle(unscheduled).slice(0, config.limit)
    }

    case 'module':
    default:
      return orderForLearning(pool, cards).slice(0, config.limit)
  }
}
