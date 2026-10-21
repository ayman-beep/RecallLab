/**
 * Browser smoke test (Playwright).
 *
 *   npm run dev            # in one terminal
 *   npm run smoke          # in another
 *
 * Exercises the real UI: navigation, a full three-consecutive-correct mastery
 * loop, persistence across reloads, cloze and categorization drills, the review
 * queue, statistics, settings and export.
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const SHOTS = 'screenshots'
mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 950 } })
const page = await context.newPage()

const consoleErrors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
})
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`))

const step = (name) => console.log(`  → ${name}`)

// ---------------------------------------------------------------- dashboard
await page.goto(BASE, { waitUntil: 'networkidle' })
step('dashboard loads')
await page.getByRole('heading', { level: 1 }).first().waitFor()
assert.match(await page.locator('h1').first().innerText(), /ready for some active recall/i)
await page.screenshot({ path: `${SHOTS}/01-dashboard-empty.png`, fullPage: true })

// ------------------------------------------------------------- learn a card
step('start a single-card learning session')
await page.goto(`${BASE}/study?scope=mistakes&type=learn&limit=1&ids=w1-deep-learning`, {
  waitUntil: 'networkidle',
})
await page.getByText('Recall prompt').waitFor()
const answerInput = page.locator('#answer-input')
await answerInput.waitFor()

step('wrong answer shows red feedback, the answer and an explanation')
await answerInput.fill('Shallow Learning')
await page.getByRole('button', { name: /submit answer/i }).click()
await page.getByText('Not quite').waitFor()
await page.getByText('Correct answer:').waitFor()
assert.match(await page.locator('section[role="status"]').innerText(), /Deep Learning/)
assert.match(await page.locator('body').innerText(), /0 \/ 3\s*consecutive correct/)
await page.screenshot({ path: `${SHOTS}/03-session-wrong.png`, fullPage: true })

await page.getByRole('button', { name: /try again/i }).click()

step('three consecutive correct answers clear the gate')
for (let i = 1; i <= 3; i += 1) {
  await page.locator('#answer-input').fill('Deep Learning')
  await page.getByRole('button', { name: /submit answer/i }).click()
  await page.getByText('Correct', { exact: false }).first().waitFor()
  const counterText = await page.locator('body').innerText()
  if (i < 3) {
    assert.match(counterText, new RegExp(`${i} / 3\\s*consecutive correct`))
  } else {
    assert.match(counterText, /Mastery gate cleared/)
  }
  if (i < 3) await page.getByRole('button', { name: /try again/i }).click()
}
await page.getByText('mastery gate cleared', { exact: false }).first().waitFor()
await page.screenshot({ path: `${SHOTS}/04-session-mastered.png`, fullPage: true })

step('session summary reports accurate numbers')
await page.getByRole('button', { name: /finish session/i }).click()
await page.getByText('Session complete').waitFor()
const summaryText = await page.locator('main, body').first().innerText()
assert.match(summaryText, /incorrect submissions\s*1/i)
assert.match(summaryText, /correct submissions\s*3/i)
assert.match(summaryText, /concepts mastered\s*1/i)
await page.screenshot({ path: `${SHOTS}/05-session-summary.png`, fullPage: true })

// -------------------------------------------------------------- persistence
step('progress survives a reload')
const stored = await page.evaluate(() => {
  const raw = localStorage.getItem('recalllab.datascience.progress.v1')
  return raw ? JSON.parse(raw) : null
})
assert.ok(stored, 'progress should be persisted to localStorage')
assert.equal(stored.cards['w1-deep-learning'].gatePassed, true)
assert.equal(stored.cards['w1-deep-learning'].box, 1)
assert.ok(stored.cards['w1-deep-learning'].nextReview, 'next review date must be set')
assert.equal(stored.sessions.length >= 1, true)
assert.equal(stored.streak.days.length, 1)

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.getByText('Spaced repetition · Leitner boxes').waitFor()
const dashboardText = await page.locator('main').innerText()
assert.equal(/0 of 188 concepts scheduled/.test(dashboardText), false, 'mastery must reflect saved progress')
await page.screenshot({ path: `${SHOTS}/02-dashboard-progress.png`, fullPage: true })

// -------------------------------------------------------------------- cloze
step('cloze drill validates each blank individually')
await page.goto(`${BASE}/study?scope=mistakes&type=practice&limit=1&ids=w4-tidy-data`, {
  waitUntil: 'networkidle',
})
const blanks = page.locator('input[aria-label^="Blank"]')
assert.equal(await blanks.count(), 3)
await blanks.nth(0).fill('variable')
await blanks.nth(1).fill('observation')
await blanks.nth(2).fill('table') // wrong
await page.getByRole('button', { name: /submit answer/i }).click()
await page.getByText('Not quite').waitFor()
const clozePanel = await page.locator('section[role="status"]').innerText()
assert.match(clozePanel, /Incorrect blank: 3/)
assert.match(clozePanel, /unit/)
await page.screenshot({ path: `${SHOTS}/06-cloze-feedback.png`, fullPage: true })

// --------------------------------------------------------- categorization
step('categorization drill requires every placement')
await page.goto(`${BASE}/study?scope=mistakes&type=practice&limit=1&ids=w1-ai-ml-dl-ds`, {
  waitUntil: 'networkidle',
})
const groups = page.locator('fieldset [role="group"]')
assert.equal(await groups.count(), 4)
await groups.nth(0).getByRole('button', { name: 'AI', exact: true }).click()
await groups.nth(1).getByRole('button', { name: 'ML', exact: true }).click()
await groups.nth(2).getByRole('button', { name: 'DS', exact: true }).click() // wrong on purpose
await groups.nth(3).getByRole('button', { name: 'DS', exact: true }).click()
await page.getByRole('button', { name: /submit answer/i }).click()
await page.getByText('Not quite').waitFor()
assert.match(await page.locator('section[role="status"]').innerText(), /placements were incorrect/)
await page.screenshot({ path: `${SHOTS}/07-categorize-feedback.png`, fullPage: true })

// --------------------------------------------------------------- navigation
step('all pages render')
for (const [path, probe] of [
  ['/learn', 'Active recall engine'],
  ['/curriculum', 'Curriculum'],
  ['/curriculum/week/11', 'Decision Tree Theory'],
  ['/review', 'Review Queue'],
  ['/statistics', 'Statistics'],
  ['/settings', 'Settings'],
]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  const text = await page.locator('body').innerText()
  assert.ok(text.includes(probe), `${path} should contain "${probe}"`)
  assert.equal(await page.locator('text=Page not found').count(), 0)
}

step('curriculum search filters concepts')
await page.goto(`${BASE}/curriculum`, { waitUntil: 'networkidle' })
await page.getByLabel('Search curriculum').fill('entropy')
await page.waitForTimeout(300)
const searchText = await page.locator('body').innerText()
assert.match(searchText, /Matching concepts/)
assert.match(searchText, /Entropy/)
await page.screenshot({ path: `${SHOTS}/08-curriculum-search.png`, fullPage: true })

step('review queue empty state is helpful')
await page.goto(`${BASE}/review`, { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
assert.match(await page.locator('body').innerText(), /Leitner|Box 1/)
await page.screenshot({ path: `${SHOTS}/09-review-queue.png`, fullPage: true })

// ------------------------------------------------------------- statistics
step('statistics reflect the recorded session')
await page.goto(`${BASE}/statistics`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const statsText = await page.locator('body').innerText()
assert.match(statsText, /Submissions/)
assert.equal(/No statistics yet/.test(statsText), false)
await page.screenshot({ path: `${SHOTS}/10-statistics.png`, fullPage: true })

// ---------------------------------------------------------------- settings
step('theme toggle persists')
await page.goto(`${BASE}/settings`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: /^Light/ }).click()
await page.waitForTimeout(200)
assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), false)
await page.screenshot({ path: `${SHOTS}/11-settings-light.png`, fullPage: true })
await page.reload({ waitUntil: 'networkidle' })
assert.equal(
  await page.evaluate(() => document.documentElement.classList.contains('dark')),
  false,
  'theme preference should survive a reload',
)
await page.getByRole('button', { name: /^Dark/ }).click()
await page.waitForTimeout(200)

step('export produces a JSON download')
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: /export json/i }).click(),
])
assert.match(download.suggestedFilename(), /recalllab-progress-.*\.json/)

// ------------------------------------------------------------ mobile layout
step('mobile layout renders with bottom navigation')
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
const mobilePage = await mobile.newPage()
await mobilePage.goto(BASE, { waitUntil: 'networkidle' })
await mobilePage.getByRole('navigation', { name: 'Mobile navigation' }).waitFor()
await mobilePage.screenshot({ path: `${SHOTS}/12-mobile-dashboard.png`, fullPage: true })
await mobilePage.goto(`${BASE}/curriculum/week/8`, { waitUntil: 'networkidle' })
await mobilePage.screenshot({ path: `${SHOTS}/13-mobile-module.png`, fullPage: true })
await mobile.close()

await browser.close()

if (consoleErrors.length > 0) {
  console.error('\nConsole errors detected:')
  for (const error of consoleErrors) console.error(`  ! ${error}`)
  process.exit(1)
}
console.log('\nSmoke test passed with no console errors.\n')
