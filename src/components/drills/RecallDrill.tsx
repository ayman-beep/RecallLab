import type { Concept } from '../../types'
import type { SessionFeedback } from '../../hooks/useStudySession'
import type { AnswerPayload } from '../../engine/payload'
import { ShortAnswerDrill } from './ShortAnswerDrill'
import { ClozeDrill } from './ClozeDrill'
import { CategorizationAssignDrill, CategorizationMultiDrill } from './CategorizationDrill'

interface Props {
  concept: Concept
  payload: AnswerPayload
  onChange: (payload: AnswerPayload) => void
  onSubmit: () => void
  disabled: boolean
  feedback: SessionFeedback | null
  revealed: boolean
}

/** Single entry point that renders the recall mode appropriate to the card. */
export function RecallDrill({ concept, payload, onChange, onSubmit, disabled, feedback, revealed }: Props) {
  const drill = concept.drill

  if (drill.mode === 'short') {
    return (
      <ShortAnswerDrill
        drill={drill}
        value={payload.text ?? ''}
        onChange={(text) => onChange({ ...payload, text })}
        onSubmit={onSubmit}
        disabled={disabled}
        revealed={revealed}
        isCorrect={feedback ? feedback.correct : null}
      />
    )
  }

  if (drill.mode === 'cloze') {
    const values = payload.blanks ?? drill.blanks.map(() => '')
    return (
      <ClozeDrill
        drill={drill}
        values={values}
        onChange={(index, value) => {
          const next = [...values]
          next[index] = value
          onChange({ ...payload, blanks: next })
        }}
        onSubmit={onSubmit}
        disabled={disabled}
        results={feedback?.cloze?.perBlank ?? null}
      />
    )
  }

  if (drill.variant === 'assign') {
    return (
      <CategorizationAssignDrill
        drill={drill}
        assignments={payload.assignments ?? {}}
        onChange={(itemId, categoryId) =>
          onChange({
            ...payload,
            assignments: { ...payload.assignments, [itemId]: categoryId },
          })
        }
        disabled={disabled}
        results={feedback?.assign?.perItem ?? null}
      />
    )
  }

  const selected = payload.multi ?? []
  return (
    <CategorizationMultiDrill
      drill={drill}
      selected={selected}
      onToggle={(id) =>
        onChange({
          ...payload,
          multi: selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id],
        })
      }
      disabled={disabled}
      missed={feedback?.multi?.missedIds}
      falsePositives={feedback?.multi?.falsePositiveIds}
    />
  )
}
