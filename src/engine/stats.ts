/**
 * Pure analytics derived from curriculum + persisted progress.
 * Nothing here is hard-coded: every number on the dashboard and statistics
 * pages is computed from `AppState`.
 */

import type {
  AppState,
  CardProgress,
  Concept,
  LeitnerBox,
  WeekModule,
  WeekStats,
} from '../types'
import { addDays, diffDays, fromISODay, isDue, isOverdue, lastNDays, toISODay, type ISODay } from '../utils/dates'
import { BOX_ORDER } from './scheduler'

export interface MasteryBucket {
  deepMastered: number
  reviewing: number
  learning: number
  notStarted: number
  due: number
  total: number
  /** Cleared-gate coverage, 0–100. "Mastery" throughout the UI. */
  masteryPercent: number
  /** Box-5 coverage, 0–100. */
  deepPercent: number
  status: 'not-started' | 'in-progress' | 'mastered' | 'due'
}

export function bucketFor(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  today: ISODay = toISODay(),
): MasteryBucket {
  let deepMastered = 0
  let reviewing = 0
  let learning = 0
  let notStarted = 0
  let due = 0

  for (const concept of concepts) {
    const p = cards[concept.id]
    if (!p || p.attempts === 0) {
      notStarted += 1
      continue
    }
    if (!p.gatePassed) {
      learning += 1
      continue
    }
    if (isDue(p.nextReview, today)) due += 1
    if (p.box === 5) deepMastered += 1
    else reviewing += 1
  }

  const total = concepts.length || 1
  const gated = deepMastered + reviewing
  const masteryPercent = Math.round((gated / total) * 100)
  const deepPercent = Math.round((deepMastered / total) * 100)
  const allGated = gated === concepts.length && concepts.length > 0

  let status: MasteryBucket['status'] = 'in-progress'
  if (notStarted === concepts.length) status = 'not-started'
  else if (due > 0) status = 'due'
  else if (allGated) status = 'mastered'

  return {
    deepMastered,
    reviewing,
    learning,
    notStarted,
    due,
    total: concepts.length,
    masteryPercent,
    deepPercent,
    status,
  }
}

export function weekStats(
  weeks: WeekModule[],
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  today: ISODay = toISODay(),
): WeekStats[] {
  return weeks.map((week) => {
    const weekConcepts = concepts.filter((c) => c.week === week.week)
    const bucket = bucketFor(weekConcepts, cards, today)
    return {
      week: week.week,
      total: bucket.total,
      mastered: bucket.deepMastered + bucket.reviewing,
      learning: bucket.learning,
      due: bucket.due,
      notStarted: bucket.notStarted,
      masteryPercent: bucket.masteryPercent,
      deepMastered: bucket.deepMastered,
      status: bucket.status,
    }
  })
}

export interface OverviewData extends MasteryBucket {
  /** Gate-cleared concepts (Box 1–5). */
  mastered: number
  /** Alias of `learning` — attempted but gate open. */
  inProgress: number
  /** Alias of `due` — scheduled for today or earlier. */
  dueToday: number
  /** Due cards whose scheduled day has already passed. */
  overdue: number
  totalConcepts: number
  totalAttempts: number
  totalCorrect: number
  totalIncorrect: number
  accuracy: number
  reviewSuccessRate: number
  reviewsCompleted: number
  totalStudyMs: number
  boxCounts: Record<LeitnerBox, number>
  unscheduled: number
  sessionsCount: number
  studiedToday: boolean
  attemptsToday: number
  correctToday: number
  gateOpen: number
}

export function buildOverview(
  concepts: Concept[],
  state: AppState,
  today: ISODay = toISODay(),
): OverviewData {
  const bucket = bucketFor(concepts, state.cards, today)
  const cards = Object.values(state.cards)

  const totalAttempts = cards.reduce((sum, c) => sum + c.attempts, 0)
  const totalCorrect = cards.reduce((sum, c) => sum + c.correct, 0)
  const totalIncorrect = cards.reduce((sum, c) => sum + c.incorrect, 0)

  let reviewAttempts = 0
  let reviewCorrect = 0
  for (const card of cards) {
    for (const event of card.history) {
      if (event.source === 'review') {
        reviewAttempts += 1
        if (event.correct) reviewCorrect += 1
      }
    }
  }

  const boxCounts: Record<LeitnerBox, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const card of cards) {
    if (card.gatePassed && card.box >= 1) boxCounts[card.box as LeitnerBox] += 1
  }

  const attemptsToday = cards.reduce(
    (sum, c) => sum + c.history.filter((h) => h.day === today).length,
    0,
  )
  const correctToday = cards.reduce(
    (sum, c) => sum + c.history.filter((h) => h.day === today && h.correct).length,
    0,
  )

  const overdue = dueCards(concepts, state.cards, today).filter((row) => row.overdueDays > 0).length

  return {
    ...bucket,
    mastered: bucket.deepMastered + bucket.reviewing,
    inProgress: bucket.learning,
    dueToday: bucket.due,
    overdue,
    totalConcepts: bucket.total,
    totalAttempts,
    totalCorrect,
    totalIncorrect,
    accuracy: totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    reviewSuccessRate: reviewAttempts
      ? Math.round((reviewCorrect / reviewAttempts) * 100)
      : 0,
    reviewsCompleted: reviewAttempts,
    totalStudyMs: state.sessions.reduce((sum, s) => sum + s.durationMs, 0),
    boxCounts,
    unscheduled: cards.filter((c) => c.gatePassed && !c.nextReview).length,
    sessionsCount: state.sessions.length,
    studiedToday: state.streak.lastStudyDay === today,
    attemptsToday,
    correctToday,
    gateOpen: bucket.learning,
  }
}

/** Cards whose scheduled review day is today or earlier, most overdue first. */
export function dueCards(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  today: ISODay = toISODay(),
): { concept: Concept; progress: CardProgress; overdueDays: number }[] {
  const rows: { concept: Concept; progress: CardProgress; overdueDays: number }[] = []
  for (const concept of concepts) {
    const p = cards[concept.id]
    if (!p || !p.gatePassed || !isDue(p.nextReview, today)) continue
    rows.push({
      concept,
      progress: p,
      overdueDays: p.nextReview ? Math.max(0, diffDays(p.nextReview, today)) : 0,
    })
  }
  return rows.sort((a, b) => {
    if (a.overdueDays !== b.overdueDays) return b.overdueDays - a.overdueDays
    return (a.progress.nextReview ?? '').localeCompare(b.progress.nextReview ?? '')
  })
}

/** Scheduled but not yet due, soonest first. */
export function upcomingCards(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  today: ISODay = toISODay(),
): { concept: Concept; progress: CardProgress; inDays: number }[] {
  const rows: { concept: Concept; progress: CardProgress; inDays: number }[] = []
  for (const concept of concepts) {
    const p = cards[concept.id]
    if (!p || !p.gatePassed || !p.nextReview || isDue(p.nextReview, today)) continue
    rows.push({ concept, progress: p, inDays: diffDays(today, p.nextReview) })
  }
  return rows.sort((a, b) => a.inDays - b.inDays)
}

/** Unscheduled cards that still need to clear the mastery gate. */
export function gateOpenCards(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
): { concept: Concept; progress: CardProgress | undefined }[] {
  return concepts
    .filter((c) => {
      const p = cards[c.id]
      return !p || !p.gatePassed
    })
    .map((concept) => ({ concept, progress: cards[concept.id] }))
}

export interface DailyActivity {
  day: ISODay
  submissions: number
  correct: number
  minutes: number
}

export function dailyActivity(state: AppState, days = 14): DailyActivity[] {
  const window = lastNDays(days)
  const map = new Map<ISODay, DailyActivity>(
    window.map((day) => [day, { day, submissions: 0, correct: 0, minutes: 0 }]),
  )

  for (const card of Object.values(state.cards)) {
    for (const event of card.history) {
      const row = map.get(event.day)
      if (!row) continue
      row.submissions += 1
      if (event.correct) row.correct += 1
    }
  }

  for (const session of state.sessions) {
    const day = session.startedAt.slice(0, 10)
    const row = map.get(day)
    if (row) row.minutes += session.durationMs / 60000
  }

  return window.map((day) => {
    const row = map.get(day)!
    return { ...row, minutes: Math.round(row.minutes) }
  })
}

export interface HeatmapCell {
  day: ISODay
  submissions: number
  level: 0 | 1 | 2 | 3 | 4
}

/** GitHub-style study heatmap for the trailing `weeks` weeks (Monday-start columns). */
export function heatmap(state: AppState, weeks = 14): { cells: HeatmapCell[]; max: number }[] {
  const activity = dailyActivity(state, weeks * 7 + 7)
  const index = new Map(activity.map((row) => [row.day, row]))
  const today = activity[activity.length - 1]?.day ?? toISODay()

  // Walk back to the Monday that starts the earliest displayed week.
  const startDate = fromISODay(addDays(today, -(weeks - 1) * 7))
  const weekday = startDate.getDay() // 0 = Sunday
  const start = addDays(toISODay(startDate), weekday === 0 ? -6 : 1 - weekday)

  const max = Math.max(1, ...activity.map((a) => a.submissions))
  const level = (n: number): HeatmapCell['level'] => {
    if (n === 0) return 0
    const ratio = n / max
    if (ratio <= 0.25) return 1
    if (ratio <= 0.5) return 2
    if (ratio <= 0.75) return 3
    return 4
  }

  const columns: { cells: HeatmapCell[]; max: number }[] = []
  let cursor = start
  while (cursor <= today) {
    const cells: HeatmapCell[] = []
    for (let i = 0; i < 7 && cursor <= today; i += 1) {
      const submissions = index.get(cursor)?.submissions ?? 0
      cells.push({ day: cursor, submissions, level: level(submissions) })
      cursor = addDays(cursor, 1)
    }
    columns.push({ cells, max })
  }
  return columns
}

export interface MissedConcept {
  concept: Concept
  incorrect: number
  attempts: number
  accuracy: number
}

export function mostMissed(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  limit = 5,
): MissedConcept[] {
  return concepts
    .map((concept) => {
      const p = cards[concept.id]
      return {
        concept,
        incorrect: p?.incorrect ?? 0,
        attempts: p?.attempts ?? 0,
        accuracy: p && p.attempts ? Math.min(100, Math.round((p.correct / p.attempts) * 100)) : 0,
      }
    })
    .filter((row) => row.incorrect > 0)
    .sort((a, b) => b.incorrect - a.incorrect || a.accuracy - b.accuracy)
    .slice(0, limit)
}

export interface TopicMastery {
  key: string
  week: number
  topic: string
  total: number
  mastered: number
  percent: number
}

export function topicMastery(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
): TopicMastery[] {
  const map = new Map<string, TopicMastery>()
  for (const concept of concepts) {
    const key = `${concept.week}::${concept.topic}`
    const row =
      map.get(key) ??
      { key, week: concept.week, topic: concept.topic, total: 0, mastered: 0, percent: 0 }
    row.total += 1
    if (cards[concept.id]?.gatePassed) row.mastered += 1
    row.percent = Math.round((row.mastered / row.total) * 100)
    map.set(key, row)
  }
  return [...map.values()].sort((a, b) => a.percent - b.percent || a.week - b.week)
}

/** Submission accuracy for the last `days` days. */
export function accuracyTrend(state: AppState, days = 7): { day: ISODay; correct: number; incorrect: number; accuracy: number }[] {
  return dailyActivity(state, days).map((row) => ({
    day: row.day,
    correct: row.correct,
    incorrect: row.submissions - row.correct,
    accuracy: row.submissions ? Math.round((row.correct / row.submissions) * 100) : 0,
  }))
}

export function upcomingLoad(
  concepts: Concept[],
  cards: Record<string, CardProgress>,
  days = 14,
  today: ISODay = toISODay(),
): { day: ISODay; label: string; count: number }[] {
  const bins = lastNDays(days, today).map((day) => ({
    day,
    label: day,
    count: 0,
  }))
  const index = new Map(bins.map((b) => [b.day, b]))
  for (const concept of concepts) {
    const p = cards[concept.id]
    if (!p?.gatePassed || !p.nextReview) continue
    const row = index.get(p.nextReview)
    if (row) row.count += 1
  }
  return bins
}

export const boxOrder = BOX_ORDER

export function isOverdueCard(p: CardProgress, today: ISODay = toISODay()): boolean {
  return p.gatePassed && isOverdue(p.nextReview, today)
}
