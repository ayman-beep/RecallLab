/**
 * Engine self-check — no test framework required.
 *
 *   npm run check:engine
 *
 * Verifies answer normalisation, the three-consecutive-correct gate, the
 * five-box Leitner scheduler and streak arithmetic. These modules are pure, so
 * they can be reasoned about (and tested) without React or the DOM.
 */

import assert from 'node:assert/strict'
import { isAnswerAccepted, normalizeAnswer, validateCloze, validateAssignment } from '../src/engine/validation'
import { applyAttempt, createProgress, LEITNER_INTERVALS, nextReviewForBox } from '../src/engine/scheduler'
import { registerStudyDay, displayStreak, emptyStreak } from '../src/engine/streak'
import { addDays, diffDays, isDue, isOverdue } from '../src/utils/dates'
import type { CardProgress } from '../src/types'

let passed = 0
function test(name: string, fn: () => void) {
  fn()
  passed += 1
  console.log(`  ✓ ${name}`)
}

const today = '2026-03-10'
const attempt = (
  progress: CardProgress,
  correct: boolean,
  source: 'learn' | 'review' | 'practice' = 'learn',
  day = today,
) => applyAttempt(progress, { correct, source, mode: 'short', today: day })

console.log('\nAnswer normalisation')
test('trims, collapses spaces and ignores case', () => {
  assert.equal(normalizeAnswer('  Deep   Learning '), 'deep learning')
})
test('ignores a single trailing full stop', () => {
  assert.equal(normalizeAnswer('Deep Learning.'), 'deep learning')
})
test('accepts configured variants', () => {
  assert.ok(isAnswerAccepted('ml', ['Machine Learning', 'ML']))
  assert.ok(isAnswerAccepted('Machine Learning', ['Machine Learning', 'ML']))
})
test('rejects near misses (no fuzzy matching)', () => {
  assert.ok(!isAnswerAccepted('Machine Learn', ['Machine Learning']))
  assert.ok(!isAnswerAccepted('deeplearning', ['Deep Learning']))
  assert.ok(!isAnswerAccepted('', ['Deep Learning']))
})
test('rejects a wrong extra word', () => {
  assert.ok(!isAnswerAccepted('Deep Learning model', ['Deep Learning']))
})

console.log('\nCloze and categorization')
test('all blanks must be correct', () => {
  const drill = { blanks: [{ answers: ['mean'] }, { answers: ['median'] }] }
  assert.equal(validateCloze(['mean', 'median'], drill).correct, true)
  const partial = validateCloze(['Mean', 'mode'], drill)
  assert.equal(partial.correct, false)
  assert.deepEqual(partial.perBlank, [true, false])
  assert.deepEqual(partial.wrongBlanks, [2])
})
test('assignment requires every item to be right', () => {
  const drill = {
    mode: 'categorize' as const,
    variant: 'assign' as const,
    prompt: 'x',
    categories: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ],
    items: [
      { id: '1', label: 'one', categoryId: 'a' },
      { id: '2', label: 'two', categoryId: 'b' },
    ],
  }
  assert.equal(validateAssignment(drill, { '1': 'a', '2': 'b' }).correct, true)
  const partial = validateAssignment(drill, { '1': 'a', '2': 'a' })
  assert.equal(partial.correct, false)
  assert.deepEqual(partial.wrongItemIds, ['2'])
})

console.log('\nThree-consecutive-correct mastery gate')
test('gate opens only after three correct in a row', () => {
  let card = createProgress('c1')
  let outcome = attempt(card, true)
  assert.equal(outcome.progress.gatePassed, false)
  assert.equal(outcome.progress.consecutiveCorrect, 1)
  card = outcome.progress
  outcome = attempt(card, true)
  assert.equal(outcome.progress.gatePassed, false)
  assert.equal(outcome.progress.consecutiveCorrect, 2)
  card = outcome.progress
  outcome = attempt(card, true)
  assert.equal(outcome.progress.gatePassed, true)
  assert.equal(outcome.gateCleared, true)
  assert.equal(outcome.progress.box, 1)
  assert.equal(outcome.progress.nextReview, addDays(today, LEITNER_INTERVALS[1]))
})
test('a miss resets the counter to zero immediately', () => {
  let card = createProgress('c2')
  card = attempt(card, true).progress
  card = attempt(card, true).progress
  assert.equal(card.consecutiveCorrect, 2)
  const outcome = attempt(card, false)
  assert.equal(outcome.progress.consecutiveCorrect, 0)
  assert.equal(outcome.progress.gatePassed, false)
  assert.equal(outcome.progress.nextReview, null)
})
test('three new correct answers are needed after a miss', () => {
  let card = attempt(attempt(createProgress('c3'), true).progress, true).progress
  card = attempt(card, false).progress
  card = attempt(card, true).progress
  card = attempt(card, true).progress
  assert.equal(card.gatePassed, false)
  card = attempt(card, true).progress
  assert.equal(card.gatePassed, true)
})

console.log('\nLeitner scheduling')
const scheduled = (box: 1 | 2 | 3 | 4 | 5, nextReview: string): CardProgress => ({
  ...createProgress('s'),
  gatePassed: true,
  box,
  nextReview,
  consecutiveCorrect: 3,
  attempts: 3,
  correct: 3,
})
test('correct review advances one box and reschedules with the new interval', () => {
  const outcome = attempt(scheduled(1, today), true, 'review')
  assert.equal(outcome.progress.box, 2)
  assert.equal(outcome.advanced, true)
  assert.equal(outcome.progress.nextReview, nextReviewForBox(2, today))
  assert.equal(diffDays(today, outcome.progress.nextReview!), 3)
})
test('box 5 stays in box 5 with another 30-day wait', () => {
  const outcome = attempt(scheduled(5, today), true, 'review')
  assert.equal(outcome.progress.box, 5)
  assert.equal(outcome.stayedTop, true)
  assert.equal(outcome.advanced, true)
  assert.equal(diffDays(today, outcome.progress.nextReview!), 30)
})
test('a missed review returns to box 1 and re-opens the gate', () => {
  const outcome = attempt(scheduled(4, today), false, 'review')
  assert.equal(outcome.progress.box, 1)
  assert.equal(outcome.progress.gatePassed, false)
  assert.equal(outcome.progress.consecutiveCorrect, 0)
  assert.equal(outcome.progress.nextReview, null)
  assert.equal(outcome.reset, true)
})
test('a failed card cannot advance until the gate is cleared again', () => {
  let card = attempt(scheduled(3, today), false, 'review').progress
  assert.equal(card.nextReview, null)
  card = attempt(card, true, 'learn').progress
  assert.equal(card.gatePassed, false)
  card = attempt(card, true, 'learn').progress
  card = attempt(card, true, 'learn').progress
  assert.equal(card.gatePassed, true)
  assert.equal(card.box, 1)
  assert.equal(card.nextReview, nextReviewForBox(1, today))
})
test('free practice never moves a scheduled card', () => {
  const before = scheduled(2, addDays(today, 1))
  const outcome = attempt(before, true, 'practice')
  assert.equal(outcome.progress.box, before.box)
  assert.equal(outcome.progress.nextReview, before.nextReview)
  assert.equal(outcome.advanced, false)
  assert.equal(outcome.practiceOnly, true)
})
test('overdue detection uses local calendar days', () => {
  assert.equal(isDue(addDays(today, -1), today), true)
  assert.equal(isDue(today, today), true)
  assert.equal(isDue(addDays(today, 1), today), false)
  assert.equal(isOverdue(addDays(today, -1), today), true)
  assert.equal(isOverdue(today, today), false)
})
test('all five intervals match the specification', () => {
  assert.deepEqual(LEITNER_INTERVALS, { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 })
})

console.log('\nStreaks')
test('consecutive days extend the streak', () => {
  let streak = emptyStreak()
  streak = registerStudyDay(streak, '2026-03-10')
  streak = registerStudyDay(streak, '2026-03-11')
  streak = registerStudyDay(streak, '2026-03-12')
  assert.equal(streak.current, 3)
  assert.equal(streak.longest, 3)
})
test('a gap restarts the streak but keeps the longest', () => {
  let streak = registerStudyDay(emptyStreak(), '2026-03-10')
  streak = registerStudyDay(streak, '2026-03-13')
  assert.equal(streak.current, 1)
  assert.equal(streak.longest, 1)
})
test('studying twice in one day does not double count', () => {
  let streak = registerStudyDay(emptyStreak(), '2026-03-10')
  streak = registerStudyDay(streak, '2026-03-10')
  assert.equal(streak.current, 1)
  assert.equal(streak.days.length, 1)
})
test('a stale streak displays as zero', () => {
  const streak = registerStudyDay(emptyStreak(), '2026-03-10')
  assert.equal(displayStreak(streak, '2026-03-10'), 1)
  assert.equal(displayStreak(streak, '2026-03-14'), 0)
})

console.log(`\n${passed} checks passed.\n`)
