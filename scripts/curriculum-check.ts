/**
 * Curriculum integrity check — run with `npm run check:curriculum`.
 *
 * Guards the things a data-driven card database can silently get wrong:
 * duplicate ids, cloze blanks that do not match their placeholders, category
 * ids that do not exist, empty answers and dangling related-concept links.
 */
import assert from 'node:assert/strict'
import { concepts, weeks, curriculumMeta } from '../src/data/curriculum'

const ids = new Set<string>()
let problems = 0
const fail = (message: string) => {
  problems += 1
  console.error(`  ✗ ${message}`)
}

for (const week of weeks) {
  const cards = concepts.filter((c) => c.week === week.week)
  if (cards.length < 8) fail(`Week ${week.week} has only ${cards.length} cards`)
  if (week.learningObjectives.length < 3) fail(`Week ${week.week} has too few objectives`)
}

for (const concept of concepts) {
  if (ids.has(concept.id)) fail(`duplicate id ${concept.id}`)
  ids.add(concept.id)
  if (!concept.definition || concept.definition.length < 40) fail(`${concept.id}: weak definition`)
  if (!concept.example) fail(`${concept.id}: missing example`)
  if (!concept.explanation) fail(`${concept.id}: missing explanation`)
  if (!concept.hint) fail(`${concept.id}: missing hint`)
  if (!concept.keyFacts.length) fail(`${concept.id}: missing key facts`)

  const drill = concept.drill
  if (!drill.prompt) fail(`${concept.id}: missing prompt`)

  if (drill.mode === 'short') {
    if (!drill.answers.length) fail(`${concept.id}: no accepted answers`)
    if (drill.answers.some((a) => !a.trim())) fail(`${concept.id}: blank accepted answer`)
  }

  if (drill.mode === 'cloze') {
    const placeholders = (drill.template.match(/___/g) ?? []).length
    if (placeholders === 0) fail(`${concept.id}: cloze has no blanks`)
    if (placeholders !== drill.blanks.length) {
      fail(`${concept.id}: ${placeholders} placeholders vs ${drill.blanks.length} answer sets`)
    }
    if (drill.blanks.some((b) => !b.answers.length)) fail(`${concept.id}: cloze blank without answers`)
  }

  if (drill.mode === 'categorize' && drill.variant === 'assign') {
    const categoryIds = new Set(drill.categories.map((c) => c.id))
    if (drill.items.length < 2) fail(`${concept.id}: fewer than two items`)
    for (const item of drill.items) {
      if (!categoryIds.has(item.categoryId)) fail(`${concept.id}: item ${item.id} has unknown category`)
    }
  }

  if (drill.mode === 'categorize' && drill.variant === 'multi') {
    const correct = drill.options.filter((o) => o.correct).length
    if (correct === 0) fail(`${concept.id}: no correct options`)
    if (correct === drill.options.length) fail(`${concept.id}: every option is correct`)
  }

  for (const relatedId of concept.related) {
    if (!ids.has(relatedId) && !concepts.some((c) => c.id === relatedId)) {
      fail(`${concept.id}: related id ${relatedId} does not exist`)
    }
  }
}

assert.deepEqual(
  weeks.map((w) => w.week),
  Array.from({ length: 14 }, (_, i) => i + 1),
  'weeks must be 1..14 in order',
)

console.log(
  `\nCurriculum: ${concepts.length} cards across ${weeks.length} weeks ` +
    `(${curriculumMeta.modes.short} short, ${curriculumMeta.modes.cloze} cloze, ${curriculumMeta.modes.categorize} categorization).`,
)
if (problems > 0) {
  console.error(`\n${problems} problem(s) found.\n`)
  process.exit(1)
}
console.log('All curriculum checks passed.\n')
