import { useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
import type { ClozeDrill as ClozeDrillType } from '../../types'

interface Props {
  drill: ClozeDrillType
  values: string[]
  onChange: (index: number, value: string) => void
  onSubmit: () => void
  disabled: boolean
  /** Per-blank verdicts once submitted. */
  results?: boolean[] | null
}

export function ClozeDrill({ drill, values, onChange, onSubmit, disabled, results }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const parts = drill.template.split('___')

  useEffect(() => {
    const firstEmpty = values.findIndex((v) => !v?.trim())
    const target = firstEmpty === -1 ? 0 : firstEmpty
    inputs.current[target]?.focus()
    // Only on mount / new attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusNext = (index: number) => {
    const next = inputs.current[index + 1]
    if (next) next.focus()
    else onSubmit()
  }

  return (
    <div>
      <p className="mb-3 text-[15px] leading-loose text-app-text">
        {parts.map((part, i) => (
          <span key={i}>
            <span>{part}</span>
            {i < parts.length - 1 && (
              <span className="inline-flex items-center gap-1">
                <input
                  ref={(el) => {
                    inputs.current[i] = el
                  }}
                  type="text"
                  value={values[i] ?? ''}
                  disabled={disabled}
                  onChange={(event) => onChange(i, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      focusNext(i)
                    }
                  }}
                  aria-label={`Blank ${i + 1}${drill.blanks[i]?.hint ? `: ${drill.blanks[i].hint}` : ''}`}
                  className={`mx-1 w-32 rounded-lg border border-b-2 bg-app-raised px-2.5 py-1 text-sm font-medium text-app-text outline-none transition focus:border-brand-500 sm:w-40 ${
                    results?.[i] === true
                      ? 'border-brand-500/70 border-b-brand-400'
                      : results?.[i] === false
                        ? 'border-red-500/70 border-b-red-400'
                        : 'border-app-border border-b-app-border'
                  }`}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                {results && results[i] !== undefined && (
                  <span
                    className={results[i] ? 'text-brand-400' : 'text-red-400'}
                    aria-label={results[i] ? 'Blank correct' : 'Blank incorrect'}
                  >
                    {results[i] ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </p>
      <p className="text-[11px] text-app-muted">
        {drill.blanks.length} blank{drill.blanks.length > 1 ? 's' : ''} · all blanks must be correct.
        Press Enter to move between blanks.
      </p>
    </div>
  )
}
