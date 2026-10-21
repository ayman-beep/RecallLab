import type { ReactNode } from 'react'

interface Segment {
  value: number
  className: string
  label: string
}

interface ProgressBarProps {
  /** 0–100. Used when `segments` is not supplied. */
  value?: number
  segments?: Segment[]
  height?: 'sm' | 'md' | 'lg'
  label: string
  showValue?: boolean
  tone?: 'brand' | 'amber' | 'red' | 'violet'
}

const HEIGHTS = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' } as const

const TONES = {
  brand: 'bg-brand-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
  violet: 'bg-violet-400',
} as const

/**
 * Accessible progress bar. Colour is never the only signal: the numeric label
 * and the aria-valuenow attribute carry the meaning.
 */
export function ProgressBar({
  value = 0,
  segments,
  height = 'md',
  label,
  showValue = false,
  tone = 'brand',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="w-full">
      {showValue && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-app-muted">
          <span className="sr-only">{label}</span>
          <span aria-hidden="true">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-app-raised ${HEIGHTS[height]}`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${clamped} percent`}
      >
        {segments ? (
          <div className="flex h-full w-full">
            {segments.map((segment, i) => (
              <div
                key={`${segment.label}-${i}`}
                className={`${segment.className} h-full transition-all duration-500`}
                style={{ width: `${Math.max(0, Math.min(100, segment.value))}%` }}
                title={`${segment.label}: ${Math.round(segment.value)}%`}
              />
            ))}
          </div>
        ) : (
          <div
            className={`${TONES[tone]} h-full rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  )
}

export function SegmentLegend({ segments }: { segments: { label: string; className: string; value: number }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-app-muted">
      {segments.map((s) => (
        <li key={s.label} className="inline-flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${s.className}`} aria-hidden="true" />
          <span>
            {s.label} <span className="tabular-nums text-app-text/80">{Math.round(s.value)}%</span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function RingProgress({
  value,
  size = 84,
  stroke = 8,
  children,
}: {
  value: number
  size?: number
  stroke?: number
  children?: ReactNode
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (clamped / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-app-raised"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className="stroke-brand-500 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
        {children}
      </div>
    </div>
  )
}
