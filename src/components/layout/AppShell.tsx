import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav, MobileTopBar } from './MobileNav'

export function AppShell() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  // Move focus to the new page for keyboard and screen-reader users.
  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <MobileTopBar />
          <main
            ref={mainRef}
            tabIndex={-1}
            className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-5 outline-none sm:px-6 lg:pb-10 lg:pt-8"
          >
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
