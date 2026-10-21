import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Filter, Play, Search, SlidersHorizontal, X } from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { concepts, curriculumMeta, searchConcepts, weeks } from '../data/curriculum'
import { bucketFor, weekStats } from '../engine/stats'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { WeekModuleCard } from '../components/WeekModuleCard'
import { ConceptCard } from '../components/ConceptCard'
import { EmptyState } from '../components/ui/EmptyState'
import { cardStatus } from '../engine/scheduler'
import { isDue } from '../utils/dates'
import type { Concept } from '../types'

type MasteryFilter = 'all' | 'not-started' | 'in-progress' | 'mastered' | 'due'
type ReviewFilter = 'all' | 'due' | 'scheduled' | 'unscheduled'

export default function Curriculum() {
  const { state, today, settings } = useAppState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all')
  const [mastery, setMastery] = useState<MasteryFilter>('all')
  const [review, setReview] = useState<ReviewFilter>('all')

  const stats = useMemo(() => weekStats(weeks, concepts, state.cards, today), [state.cards, today])

  const matchesConcept = (concept: Concept): boolean => {
    if (weekFilter !== 'all' && concept.week !== weekFilter) return false
    const card = state.cards[concept.id]
    const status = cardStatus(card)
    if (mastery === 'not-started' && status !== 'new') return false
    if (mastery === 'in-progress' && status !== 'learning' && status !== 'reviewing') return false
    if (mastery === 'mastered' && status !== 'mastered') return false
    if (mastery === 'due' && !(card?.gatePassed && isDue(card.nextReview, today))) return false
    if (review === 'due' && !(card?.gatePassed && isDue(card.nextReview, today))) return false
    if (review === 'scheduled' && !card?.gatePassed) return false
    if (review === 'unscheduled' && card?.gatePassed) return false
    return true
  }

  const searchedConcepts = useMemo(() => {
    const results = query.trim() ? searchConcepts(query) : []
    return results.filter(matchesConcept)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, weekFilter, mastery, review, state.cards, today])

  const filteredWeeks = useMemo(() => {
    return weeks.filter((week) => {
      if (weekFilter !== 'all' && week.week !== weekFilter) return false
      const bucket = bucketFor(
        concepts.filter((c) => c.week === week.week),
        state.cards,
        today,
      )
      if (mastery === 'not-started') return bucket.status === 'not-started'
      if (mastery === 'in-progress') return bucket.status === 'in-progress'
      if (mastery === 'mastered') return bucket.masteryPercent === 100
      if (mastery === 'due') return bucket.due > 0
      if (review === 'due') return bucket.due > 0
      if (review === 'scheduled') return bucket.deepMastered + bucket.reviewing > 0
      if (review === 'unscheduled') return bucket.deepMastered + bucket.reviewing === 0
      return true
    })
  }, [weekFilter, mastery, review, state.cards, today])

  const filtersActive = query.trim() !== '' || weekFilter !== 'all' || mastery !== 'all' || review !== 'all'

  const resetFilters = () => {
    setQuery('')
    setWeekFilter('all')
    setMastery('all')
    setReview('all')
  }

  return (
    <div>
      <PageHeader
        eyebrow="14 weekly modules"
        title="Curriculum"
        description={`${curriculumMeta.conceptCount} recall cards across ${curriculumMeta.weekCount} weeks · ${curriculumMeta.modes.short} short answer, ${curriculumMeta.modes.cloze} cloze and ${curriculumMeta.modes.categorize} categorization drills.`}
        actions={
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              navigate(`/study?scope=module&week=1&type=learn&limit=${settings.sessionSize}`)
            }
          >
            <Play size={15} aria-hidden="true" /> Start Week 1
          </button>
        }
      />

      <section className="card mb-4 p-3.5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search terms, topics and definitions…"
              aria-label="Search curriculum"
              className="input-base !py-2.5 pl-9 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 text-xs text-app-muted">
              <span className="sr-only">Filter by week</span>
              <select
                value={weekFilter}
                onChange={(event) =>
                  setWeekFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
                }
                className="rounded-lg border border-app-border bg-app-raised px-2.5 py-2 text-xs text-app-text focus:border-brand-500 focus:outline-none"
              >
                <option value="all">All weeks</option>
                {weeks.map((week) => (
                  <option key={week.week} value={week.week}>
                    Week {week.week}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs text-app-muted">
              <span className="sr-only">Filter by mastery</span>
              <select
                value={mastery}
                onChange={(event) => setMastery(event.target.value as MasteryFilter)}
                className="rounded-lg border border-app-border bg-app-raised px-2.5 py-2 text-xs text-app-text focus:border-brand-500 focus:outline-none"
              >
                <option value="all">Any mastery</option>
                <option value="not-started">Not started</option>
                <option value="in-progress">In progress</option>
                <option value="mastered">Mastered</option>
                <option value="due">Due for review</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs text-app-muted">
              <span className="sr-only">Filter by review status</span>
              <select
                value={review}
                onChange={(event) => setReview(event.target.value as ReviewFilter)}
                className="rounded-lg border border-app-border bg-app-raised px-2.5 py-2 text-xs text-app-text focus:border-brand-500 focus:outline-none"
              >
                <option value="all">Any review state</option>
                <option value="due">Due now</option>
                <option value="scheduled">Scheduled</option>
                <option value="unscheduled">Unscheduled</option>
              </select>
            </label>
            {filtersActive && (
              <button type="button" onClick={resetFilters} className="btn-ghost !px-2 !py-2 text-xs">
                <X size={13} aria-hidden="true" /> Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <SectionHeader
        title={`Modules (${filteredWeeks.length})`}
        description="Open a module for objectives, concept cards and session shortcuts."
        icon={<SlidersHorizontal size={15} aria-hidden="true" />}
      />

      {filteredWeeks.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No modules match these filters"
          description="Try clearing the mastery or review filter, or search for a different term."
          action={
            <button type="button" className="btn-secondary" onClick={resetFilters}>
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredWeeks.map((week) => (
            <WeekModuleCard key={week.week} week={week} stats={stats.find((s) => s.week === week.week)} />
          ))}
        </div>
      )}

      {query.trim() && (
        <section className="mt-6">
          <SectionHeader
            title={`Matching concepts (${searchedConcepts.length})`}
            description={`Results for “${query.trim()}”`}
            icon={<BookOpen size={15} aria-hidden="true" />}
          />
          {searchedConcepts.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No concepts found"
              description="Search matches titles, topics, definitions, key facts and examples."
            />
          ) : (
            <div className="grid gap-2.5 lg:grid-cols-2">
              {searchedConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  progress={state.cards[concept.id]}
                  today={today}
                  onPractice={(c) =>
                    navigate(
                      `/study?scope=mistakes&type=practice&limit=1&ids=${c.id}`,
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
