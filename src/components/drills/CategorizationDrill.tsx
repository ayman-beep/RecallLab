import { Check, X } from 'lucide-react'
import type { CategorizeDrill as CategorizeDrillType } from '../../types'

interface AssignProps {
  drill: Extract<CategorizeDrillType, { variant: 'assign' }>
  assignments: Record<string, string | null>
  onChange: (itemId: string, categoryId: string) => void
  disabled: boolean
  results?: Record<string, boolean> | null
}

export function CategorizationAssignDrill({
  drill,
  assignments,
  onChange,
  disabled,
  results,
}: AssignProps) {
  return (
    <fieldset className="space-y-2.5" disabled={disabled}>
      <legend className="sr-only">{drill.prompt}</legend>
      {drill.items.map((item) => {
        const chosen = assignments[item.id] ?? null
        const verdict = results?.[item.id]
        return (
          <div
            key={item.id}
            className={`rounded-xl border p-3 transition ${
              verdict === true
                ? 'border-brand-500/40 bg-brand-500/[0.06]'
                : verdict === false
                  ? 'border-red-500/40 bg-red-500/[0.06]'
                  : 'border-app-border bg-app-raised'
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="text-sm text-app-text">{item.label}</p>
              {verdict !== undefined && (
                <span
                  className={verdict ? 'text-brand-400' : 'text-red-400'}
                  aria-label={verdict ? 'Correct placement' : 'Incorrect placement'}
                >
                  {verdict ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Category for ${item.label}`}>
              {drill.categories.map((category) => {
                const active = chosen === category.id
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onChange(item.id, category.id)}
                    aria-pressed={active}
                    disabled={disabled}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'border-brand-500/60 bg-brand-500/15 text-brand-200'
                        : 'border-app-border bg-app-surface text-app-muted hover:border-brand-500/40 hover:text-app-text'
                    }`}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </fieldset>
  )
}

interface MultiProps {
  drill: Extract<CategorizeDrillType, { variant: 'multi' }>
  selected: string[]
  onToggle: (optionId: string) => void
  disabled: boolean
  missed?: string[]
  falsePositives?: string[]
}

export function CategorizationMultiDrill({
  drill,
  selected,
  onToggle,
  disabled,
  missed,
  falsePositives,
}: MultiProps) {
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="sr-only">{drill.prompt}</legend>
      {drill.options.map((option) => {
        const isSelected = selected.includes(option.id)
        const expected = Boolean(missed || falsePositives)
        const missedThis = expected && missed?.includes(option.id)
        const wrongPick = expected && falsePositives?.includes(option.id)
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
              missedThis
                ? 'border-amber-400/50 bg-amber-400/[0.07]'
                : wrongPick
                  ? 'border-red-500/45 bg-red-500/[0.07]'
                  : isSelected
                    ? 'border-brand-500/45 bg-brand-500/[0.07]'
                    : 'border-app-border bg-app-raised hover:border-app-border/80'
            } ${disabled ? 'cursor-default' : ''}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(option.id)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-500"
            />
            <span className="flex-1 leading-snug">{option.label}</span>
            {missedThis && (
              <span className="text-[11px] font-semibold text-amber-300">should be selected</span>
            )}
            {wrongPick && <span className="text-[11px] font-semibold text-red-300">incorrect</span>}
          </label>
        )
      })}
    </fieldset>
  )
}
