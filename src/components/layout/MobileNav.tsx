import { NavLink, Link } from 'react-router-dom'
import { Flame, Settings as SettingsIcon } from 'lucide-react'
import { NAV_ITEMS } from './navItems'
import { Logo } from './Logo'
import { useAppState } from '../../context/AppStateContext'
import { displayStreak } from '../../engine/streak'
import { buildOverview } from '../../engine/stats'
import { concepts } from '../../data/curriculum'

export function MobileTopBar() {
  const { state, today } = useAppState()
  const streak = displayStreak(state.streak, today)
  const overview = buildOverview(concepts, state, today)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-app-border bg-app-bg/90 px-4 py-3 backdrop-blur lg:hidden">
      <Logo />
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-app-border bg-app-surface px-2.5 py-1 text-xs font-medium">
          <Flame size={13} className={streak > 0 ? 'text-amber-400' : 'text-app-muted'} aria-hidden="true" />
          {streak}
        </span>
        {overview.dueToday > 0 && (
          <Link
            to="/review"
            className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-400/30 dark:text-amber-300"
          >
            {overview.dueToday} due
          </Link>
        )}
        <Link
          to="/settings"
          aria-label="Settings"
          className="grid h-8 w-8 place-items-center rounded-lg border border-app-border bg-app-surface text-app-muted"
        >
          <SettingsIcon size={15} aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}

export function MobileNav() {
  const { state, today } = useAppState()
  const overview = buildOverview(concepts, state, today)
  const items = NAV_ITEMS.filter((item) => item.primary)

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-app-border bg-app-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                  isActive ? 'text-emerald-600 dark:text-brand-400' : 'text-app-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon size={19} aria-hidden="true" />
                    {item.to === '/review' && overview.dueToday > 0 && (
                      <span className="absolute -right-1.5 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-amber-400 px-0.5 text-[8px] font-bold text-ink-950">
                        {overview.dueToday > 9 ? '9+' : overview.dueToday}
                      </span>
                    )}
                  </span>
                  <span>{item.shortLabel}</span>
                  {isActive && <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-brand-400" />}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
