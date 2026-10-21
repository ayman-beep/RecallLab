import { useEffect, useRef } from 'react'
import type { ShortAnswerDrill as ShortAnswerDrillType } from '../../types'

interface Props {
  drill: ShortAnswerDrillType
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled: boolean
  revealed: boolean
  isCorrect?: boolean | null
}

export function ShortAnswerDrill({ drill, value, onChange, onSubmit, disabled, revealed, isCorrect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (drill.multiline) areaRef.current?.focus()
    else inputRef.current?.focus()
  }, [drill])

  const ringClass =
    isCorrect === true
      ? 'border-brand-500/60 bg-brand-500/[0.06]'
      : isCorrect === false
        ? 'border-red-500/60 bg-red-500/[0.06]'
        : ''

  if (drill.multiline) {
    return (
      <div>
        <label htmlFor="answer-textarea" className="label mb-2 block">
          Your answer
        </label>
        <textarea
          id="answer-textarea"
          ref={areaRef}
          rows={4}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              onSubmit()
            }
          }}
          placeholder={drill.placeholder ?? 'Type your answer…'}
          className={`input-base resize-y leading-relaxed ${ringClass}`}
          aria-describedby="answer-help"
        />
        <p id="answer-help" className="mt-1.5 text-[11px] text-app-muted">
          Press ⌘/Ctrl + Enter to submit. Wording must match exactly (case and spacing are ignored).
        </p>
      </div>
    )
  }

  return (
    <div>
      <label htmlFor="answer-input" className="label mb-2 block">
        Your answer
      </label>
      <input
        id="answer-input"
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onSubmit()
          }
        }}
        placeholder={drill.placeholder ?? 'Type your answer…'}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`input-base text-base ${ringClass}`}
        aria-describedby="answer-help"
      />
      <p id="answer-help" className="mt-1.5 text-[11px] text-app-muted">
        Press Enter to submit. Case, extra spaces and a trailing full stop are ignored.
      </p>
      {revealed && (
        <p className="mt-2 text-xs text-app-muted">
          Answer revealed: <strong className="text-app-text">{drill.answers[0]}</strong>
        </p>
      )}
    </div>
  )
}
