/**
 * Generates a realistic demo progress state used by the visual check.
 * Writes `scripts/seed-state.json`, which `scripts/visual-check.mjs` loads into
 * localStorage. Purely a development aid — never shipped to the browser bundle.
 *
 *   npx tsx scripts/make-seed.ts
 */
import { writeFileSync } from 'node:fs'
import { concepts } from '../src/data/curriculum'
import { createProgress } from '../src/engine/scheduler'
import { createInitialState } from '../src/engine/persistence'
import { addDays, toISODay } from '../src/utils/dates'
import type { AppState, CardProgress, LeitnerBox, SessionRecord } from '../src/types'

const today = toISODay()
let seed = 7
const random = () => {
  seed = (seed * 48_271) % 2_147_483_647
  return seed / 2_147_483_647
}

const state: AppState = createInitialState()
const sessions: SessionRecord[] = []
const studyDays = [5, 4, 3, 2, 1, 0].map((back) => addDays(today, -back))

const candidates = concepts.filter((c) => c.week <= 6)

for (const [index, concept] of candidates.entries()) {
  const bucket = (index % 11 === 0 ? 5 : index % 7 === 0 ? 3 : index % 3 === 0 ? 2 : 1) as LeitnerBox
  const card: CardProgress = {
    ...createProgress(concept.id),
    gatePassed: true,
    box: bucket,
    consecutiveCorrect: 3,
    attempts: 4 + (index % 4),
    correct: 4 + (index % 4) - (index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0),
    incorrect: index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0,
    gateClearedAt: `${studyDays[5]}T09:15:00.000Z`,
    lastAttempt: `${studyDays[0]}T09:30:00.000Z`,
  }
  // Spread review dates: overdue, due today, and future.
  const offset = index % 9 === 0 ? -2 : index % 5 === 0 ? 0 : (index % 12) + 1
  card.nextReview = addDays(today, offset)
  card.history = [studyDays[5], studyDays[4], studyDays[3]].map((day, i) => ({
    at: `${day}T09:${20 + i}:00.000Z`,
    correct: (index + i) % 4 !== 0,
    mode: concept.drill.mode,
    source: i === 0 ? 'learn' : 'review',
    boxBefore: bucket,
    boxAfter: bucket,
    day,
  }))
  state.cards[concept.id] = card
}

// A few cards mid-gate so the dashboard shows "in progress".
for (const concept of concepts.filter((c) => c.week === 7).slice(0, 3)) {
  state.cards[concept.id] = {
    ...createProgress(concept.id),
    consecutiveCorrect: 1,
    attempts: 2,
    incorrect: 1,
    correct: 1,
    lastAttempt: `${today}T08:00:00.000Z`,
  }
}

studyDays.forEach((day, i) => {
  const submissionsForDay = 18 + Math.round(random() * 26)
  const correctForDay = Math.round(submissionsForDay * (0.72 + random() * 0.2))
  sessions.push({
    id: `seed_${i}`,
    startedAt: `${day}T09:${10 + i}:00.000Z`,
    endedAt: `${day}T09:${40 + i}:00.000Z`,
    type: i % 3 === 0 ? 'learn' : 'review',
    label: i % 3 === 0 ? `Week ${i + 1}: module session` : 'Due reviews',
    submissions: submissionsForDay,
    correct: correctForDay,
    incorrect: submissionsForDay - correctForDay,
    conceptsMastered: 2 + Math.round(random() * 4),
    reviewsAdvanced: i % 3 === 0 ? 0 : 4 + Math.round(random() * 6),
    cardsReset: i % 4 === 0 ? 1 : 0,
    durationMs: (22 + Math.round(random() * 18)) * 60_000,
  })
})

state.sessions = sessions
state.streak = {
  current: 6,
  longest: 9,
  lastStudyDay: today,
  days: studyDays,
}

writeFileSync(new URL('./seed-state.json', import.meta.url), JSON.stringify(state, null, 2))
console.log(`Seed written: ${Object.keys(state.cards).length} cards, ${sessions.length} sessions.`)
