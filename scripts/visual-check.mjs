/**
 * Visual check with realistic demo data.
 *
 *   npx tsx scripts/make-seed.ts     # writes scripts/seed-state.json
 *   npm run dev                      # in another terminal
 *   node scripts/visual-check.mjs
 *
 * Loads the seed into localStorage, then screenshots every page in dark and
 * light mode plus a mobile viewport.
 */
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const SHOTS = 'screenshots'
mkdirSync(SHOTS, { recursive: true })
const seed = JSON.parse(readFileSync(new URL('./seed-state.json', import.meta.url), 'utf8'))
const KEY = 'recalllab.datascience.progress.v1'

const browser = await chromium.launch()

/** New context seeded with demo progress (optionally a different theme). */
async function newSeededContext({ viewport, theme = 'dark', mobile = false }) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile })
  const value = { ...seed, settings: { ...seed.settings, theme } }
  await ctx.addInitScript(
    ([key, state]) => {
      // Only seed once per profile; later navigations must keep in-app changes.
      if (!window.sessionStorage.getItem('seeded')) {
        window.localStorage.setItem(key, JSON.stringify(state))
        window.sessionStorage.setItem('seeded', '1')
      }
    },
    [KEY, value],
  )
  return ctx
}

const context = await newSeededContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const shot = async (name, path, opts = {}) => {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true, ...opts })
  console.log(`  ✓ ${name}`)
}

await shot('20-dashboard-dark', '/')
await shot('21-learn', '/learn')
await shot('22-curriculum', '/curriculum')
await shot('23-module-week8', '/curriculum/week/8')
await shot('24-review-queue', '/review')
await shot('25-statistics', '/statistics')
await shot('26-settings', '/settings')

// A live review drill with the seeded schedule.
await page.goto(`${BASE}/study?scope=due&type=review&limit=10`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: `${SHOTS}/27-review-session.png`, fullPage: true })
console.log('  ✓ 27-review-session')

// Light mode (separate seeded profile so the theme starts light).
const lightContext = await newSeededContext({ viewport: { width: 1440, height: 1000 }, theme: 'light' })
const lightPage = await lightContext.newPage()
for (const [name, path] of [
  ['28-dashboard-light', '/'],
  ['28b-curriculum-light', '/curriculum/week/11'],
  ['28c-statistics-light', '/statistics'],
]) {
  await lightPage.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await lightPage.waitForTimeout(450)
  await lightPage.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true })
  console.log(`  ✓ ${name}`)
}
await lightContext.close()

// Mobile.
const mobile = await newSeededContext({ viewport: { width: 390, height: 844 }, mobile: true })
const mpage = await mobile.newPage()
for (const [name, path] of [
  ['29-mobile-dashboard', '/'],
  ['30-mobile-curriculum', '/curriculum'],
  ['31-mobile-study', '/study?scope=due&type=review&limit=6'],
  ['32-mobile-stats', '/statistics'],
]) {
  await mpage.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await mpage.waitForTimeout(400)
  await mpage.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true })
  console.log(`  ✓ ${name}`)
}

await browser.close()
if (errors.length) {
  console.error('\nBrowser errors:')
  errors.forEach((e) => console.error(`  ! ${e}`))
  process.exit(1)
}
console.log('\nVisual check complete with no browser errors.\n')
