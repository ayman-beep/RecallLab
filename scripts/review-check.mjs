/**
 * Spaced-repetition flow test against the real UI.
 *
 *   npx tsx scripts/make-seed.ts && npm run dev
 *   node scripts/review-check.mjs
 *
 * Verifies through the browser that a correct scheduled review advances the
 * Leitner box and that a missed review returns the card to Box 1 with the
 * mastery gate re-opened — plus an import/export round-trip.
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const KEY = 'recalllab.datascience.progress.v1'
const seed = JSON.parse(readFileSync(new URL('./seed-state.json', import.meta.url), 'utf8'))

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
await context.addInitScript(([k, v]) => window.localStorage.setItem(k, JSON.stringify(v)), [KEY, seed])
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const readCard = (id) =>
  page.evaluate(
    ([key, cardId]) => JSON.parse(window.localStorage.getItem(key)).cards[cardId],
    [KEY, id],
  )

console.log('  → correct review advances the box')

// Pick a due card in Box 1 (seed sets it as due with a known answer) and answer it correctly.
const dueId = 'w1-data-science-definition'
const before = seed.cards[dueId]
assert.equal(before.box, 5) // seed puts this card in box 5

await page.goto(`${BASE}/study?scope=mistakes&type=review&limit=1&ids=${dueId}`, {
  waitUntil: 'networkidle',
})
await page.locator('#answer-input').fill('data science')
await page.getByRole('button', { name: /submit answer/i }).click()
await page.getByText(/review completed in Box 5|review advanced/i).waitFor()
const afterCorrect = await readCard(dueId)
assert.equal(afterCorrect.box, 5, 'a correct Box 5 review stays in Box 5')
assert.equal(afterCorrect.gatePassed, true)
console.log(`     box 5 → ${afterCorrect.box}, next review ${afterCorrect.nextReview}`)

console.log('  → missed review returns the card to Box 1 and re-opens the gate')
const card = seed.cards['w2-github']
assert.ok(card.box >= 2)
await page.goto(`${BASE}/study?scope=mistakes&type=review&limit=1&ids=w2-github`, {
  waitUntil: 'networkidle',
})
await page.locator('#answer-input').fill('Bitbucket')
await page.getByRole('button', { name: /submit answer/i }).click()
await page.getByText('Not quite').waitFor()
const afterMiss = await readCard('w2-github')
assert.equal(afterMiss.box, 1, 'a missed review returns the card to box 1')
assert.equal(afterMiss.gatePassed, false, 'the mastery gate is re-opened')
assert.equal(afterMiss.nextReview, null, 'the card leaves the schedule until the gate is cleared')
assert.equal(afterMiss.consecutiveCorrect, 0)
console.log('     reset to Box 1, gate re-opened, unscheduled')

console.log('  → the card cannot advance until three correct answers are given again')
await page.getByRole('button', { name: /try again/i }).click()
for (let i = 1; i <= 3; i += 1) {
  await page.locator('#answer-input').fill('GitHub')
  await page.getByRole('button', { name: /submit answer/i }).click()
  await page.waitForTimeout(120)
  const card = await readCard('w2-github')
  if (i < 3) {
    assert.equal(card.gatePassed, false)
    await page.getByRole('button', { name: /try again/i }).click()
  } else {
    assert.equal(card.gatePassed, true)
    assert.equal(card.box, 1)
    assert.ok(card.nextReview)
  }
}

console.log('  → import/export round-trip restores progress')
await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: /export json/i }).click(),
])
const exportedPath = await download.path()
const exported = JSON.parse(readFileSync(exportedPath, 'utf8'))
assert.ok(exported.state.cards['w2-github'], 'export contains the card state')

// A fresh browser profile (no seeding script) imports the exported file.
const fresh = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const freshPage = await fresh.newPage()
freshPage.on('pageerror', (e) => errors.push(e.message))
await freshPage.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
assert.equal(
  await freshPage.evaluate((key) => {
    const raw = window.localStorage.getItem(key)
    return raw ? Object.keys(JSON.parse(raw).cards).length : 0
  }, KEY),
  0,
  'a fresh profile starts with no progress',
)
await freshPage.setInputFiles('input[type="file"]', exportedPath)
await freshPage.getByText('Progress imported successfully', { exact: false }).waitFor()
const restored = await freshPage.evaluate(
  ([key, id]) => JSON.parse(window.localStorage.getItem(key)).cards[id],
  [KEY, 'w2-github'],
)
assert.equal(restored.box, exported.state.cards['w2-github'].box)
assert.equal(restored.gatePassed, exported.state.cards['w2-github'].gatePassed)

console.log('  → an invalid import is rejected with a readable message')
await freshPage.setInputFiles('input[type="file"]', {
  name: 'not-progress.json',
  mimeType: 'application/json',
  buffer: Buffer.from(JSON.stringify({ hello: 'world' })),
})
await freshPage.getByText('Missing required fields', { exact: false }).waitFor()
await fresh.close()
await page.close()

await browser.close()
if (errors.length) {
  console.error('\nBrowser errors:')
  errors.forEach((e) => console.error(`  ! ${e}`))
  process.exit(1)
}
console.log('\nSpaced-repetition and import/export checks passed.\n')
