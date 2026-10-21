import { Check, CircleCheck, RotateCcw } from 'lucide-react'
import { MASTERY_TARGET } from '../engine/scheduler'

interface MasteryCounterProps {
  streak: number
  gatePassed: boolean
  /** Correct answers still needed in this session. */
  required?: number
  compact?: boolean
}

/**
 * Visualises the three-consecutive-correct gate. Never relies on colour alone:
 * each dot carries a check icon and the text states the exact count.
 */
export function MasteryCounter({ streak, gatePassed, required, compact = false }: MasteryCounterProps) {
  const shown = Math.min(streak, MASTERY_TARGET)
  return (
    <div className={compact ? 'flex items-center gap-2' : 'flex flex-col gap-2'}>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: MASTERY_TARGET }).map((_, i) => {
          const filled = i < shown
          return (
            <span
              key={i}
              className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] transition-all duration-300 ${
                filled
                  ? 'border-brand-500/60 bg-brand-500/20 text-brand-300'
                  : 'border-app-border bg-app-raised text-app-muted/50'
              }`}
            >
              {filled ? <Check size={12} strokeWidth={3} /> : i + 1}
            </span>
          )
        })}
      </div>
      <p className="text-xs font-medium text-app-muted" aria-live="polite">
        {gatePassed ? (
          <span className="inline-flex items-center gap-1.5 text-brand-300">
            <CircleCheck size={13} aria-hidden="true" /> Mastery gate cleared
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <RotateCcw size={12} aria-hidden="true" />
            <span>
              <span className="tabular-nums text-app-text">{shown} / {MASTERY_TARGET}</span> consecutive
              correct
              {typeof required === 'number' && required > 1 ? ` · ${required} to go` : ''}
            </span>
          </span>
        )}
      </p>
    </div>
  )
}
