import { Link } from 'react-router-dom'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="RecallLab home">
      <span className="grid h-8 w-8 place-items-center rounded-xl border border-brand-500/30 bg-brand-500/10">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 18V7l5 7 5-7v11"
            stroke="#34d399"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19" cy="8" r="2.1" fill="#fbbf24" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-semibold tracking-tight">RecallLab</span>
          <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-app-muted">
            Data Science
          </span>
        </span>
      )}
    </Link>
  )
}
