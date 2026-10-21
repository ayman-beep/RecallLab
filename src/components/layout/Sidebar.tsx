import { NavLink } from 'react-router-dom'
import { Flame, Moon, Sun, Target } from 'lucide-react'
import { NAV_ITEMS } from './navItems'
import { Logo } from './Logo'
import { ProgressBar } from '../ui/ProgressBar'
import { useAppState } from '../../context/AppStateContext'
import { buildOverview, weekStats } from '../../engine/stats'
import { concepts, weeks } from '../../data/curriculum'
import { displayStreak, studiedOn } from '../../engine/streak'

export function Sidebar() {
  const { state, today, settings, updateSettings } = useAppState()
  const overview = buildOverview(concepts, state, today)
  const stats = weekStats(weeks, concepts, state.cards, today)
  const streak = displayStreak(state.streak, today)
  const goalDone = overview.attemptsToday
  const goalPercent = Math.min(100, Math.round((goalDone / Math.max(1, settings.dailyGoal)) * 100))
  const startedWeeks = stats.filter((s) => s.status !== 'not-started').length

  return (
    <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-app-border bg-app-surface/80 px-4 py-5 backdrop-blur lg:flex">
      <div className="px-1">
        <Logo />
      </div>

      <nav aria-label="Main navigation" className="mt-7 flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-brand-500/12 font-semibold text-app-text'
                      : 'text-app-muted hover:bg-app-raised hover:text-app-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={17}
                      className={isActive ? 'text-emerald-600 dark:text-brand-400' : 'text-app-muted group-hover:text-app-text'}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.to === '/review' && overview.dueToday > 0 && (
                      <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                        {overview.dueToday}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-3">
        <div className="rounded-xl border border-app-border bg-app-raised p-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-app-text">
              <Flame
                size={14}
                className={streak > 0 ? 'text-amber-400' : 'text-app-muted'}
                aria-hidden="true"
              />
              {streak} day streak
            </span>
            {studiedOn(state.streak, today) ? (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-brand-400">
                Active
              </span>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Pending
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <div className="mb-1 flex items-center justify-between text-[10px] text-app-muted">
              <span className="inline-flex items-center gap-1">
                <Target size={10} aria-hidden="true" /> Daily goal
              </span>
              <span className="tabular-nums">
                {goalDone}/{settings.dailyGoal}
              </span>
            </div>
            <ProgressBar value={goalPercent} label="Daily goal" height="sm" tone={goalPercent >= 100 ? 'brand' : 'amber'} />
          </div>
        </div>

        <div className="rounded-xl border border-app-border bg-app-raised p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-app-muted">Curriculum mastery</span>
            <span className="font-semibold tabular-nums">{overview.masteryPercent}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={overview.masteryPercent} label="Overall curriculum mastery" height="sm" />
          </div>
          <p className="mt-2 text-[10px] text-app-muted">
            {overview.mastered} of {overview.totalConcepts} concepts · {startedWeeks}/14 weeks started
          </p>
        </div>

        <button
          type="button"
          onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className="flex w-full items-center justify-between rounded-xl border border-app-border px-3 py-2 text-xs text-app-muted transition hover:bg-app-raised hover:text-app-text"
        >
          <span className="inline-flex items-center gap-2">
            {settings.theme === 'dark' ? <Moon size={13} aria-hidden="true" /> : <Sun size={13} aria-hidden="true" />}
            {settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
          </span>
          <span className="rounded-md border border-app-border px-1.5 py-0.5 text-[10px]">Toggle</span>
        </button>
      </div>
    </aside>
  )
}
