/**
 * Domain types for the Data Science Active Recall Trainer.
 *
 * The app is frontend-only: every type here is serialised into localStorage
 * (see `src/context/AppStateContext.tsx`). Curriculum content is static data in
 * `src/data/`.
 */

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export type RecallMode = 'short' | 'cloze' | 'categorize'

export type Difficulty = 'intro' | 'core' | 'advanced'

export type LeitnerBox = 1 | 2 | 3 | 4 | 5

export interface ShortAnswerDrill {
  mode: 'short'
  /** The recall prompt shown to the learner. */
  prompt: string
  /** answers[0] is the canonical answer; the rest are explicit accepted variants. */
  answers: string[]
  /** Use a textarea for longer conceptual answers. */
  multiline?: boolean
  placeholder?: string
}

export interface ClozeDrill {
  mode: 'cloze'
  /** Instruction line above the sentence. */
  prompt: string
  /** Sentence containing one `___` placeholder per blank. */
  template: string
  /** One entry per `___`, in order. */
  blanks: { answers: string[]; hint?: string }[]
}

export interface CategorizeAssignDrill {
  mode: 'categorize'
  variant: 'assign'
  prompt: string
  categories: { id: string; label: string }[]
  items: { id: string; label: string; categoryId: string }[]
}

export interface CategorizeMultiDrill {
  mode: 'categorize'
  variant: 'multi'
  prompt: string
  options: { id: string; label: string; correct: boolean }[]
}

export type CategorizeDrill = CategorizeAssignDrill | CategorizeMultiDrill

export type Drill = ShortAnswerDrill | ClozeDrill | CategorizeDrill

export interface Concept {
  /** Stable slug, e.g. `w1-deep-learning`. Never change after release. */
  id: string
  week: number
  /** Topic heading used for filtering / grouping. */
  topic: string
  title: string
  /** Concise, academically accurate definition. */
  definition: string
  keyFacts: string[]
  /** Realistic example to anchor the concept. */
  example: string
  /** Why the answer is what it is — shown after failures and on reveal. */
  explanation: string
  hint: string
  /** Ids of related concepts. */
  related: string[]
  difficulty: Difficulty
  drill: Drill
}

export interface WeekModule {
  week: number
  title: string
  subtitle: string
  description: string
  learningObjectives: string[]
  topics: string[]
  estimatedMinutes: number
  accent: string
}

/* ------------------------------------------------------------------ */
/* Learning progress                                                   */
/* ------------------------------------------------------------------ */

export type AttemptSource = 'learn' | 'review' | 'practice'

/**
 * - `new`        never attempted
 * - `learning`   attempted, but the 3-consecutive-correct gate is not cleared
 * - `reviewing`  gate cleared, scheduled in Leitner boxes 1–4
 * - `mastered`   gate cleared and sitting in Leitner box 5
 */
export type CardStatus = 'new' | 'learning' | 'reviewing' | 'mastered'

export interface ReviewEvent {
  /** ISO timestamp. */
  at: string
  correct: boolean
  mode: RecallMode
  source: AttemptSource
  boxBefore: LeitnerBox | 0
  boxAfter: LeitnerBox | 0
  /** Local calendar day of the attempt (`YYYY-MM-DD`). */
  day: string
}

export interface CardProgress {
  id: string
  /** Consecutive correct submissions since the last failure. */
  consecutiveCorrect: number
  /** Has the initial 3-consecutive-correct mastery gate been cleared? */
  gatePassed: boolean
  /** Leitner box. Meaningful only once `gatePassed` is true (else 0). */
  box: LeitnerBox | 0
  /** `YYYY-MM-DD` local calendar date, or null while the gate is open. */
  nextReview: string | null
  lastAttempt: string | null
  gateClearedAt: string | null
  attempts: number
  correct: number
  incorrect: number
  /** Most recent attempts first, capped for storage hygiene. */
  history: ReviewEvent[]
}

export interface SessionRecord {
  id: string
  startedAt: string
  endedAt: string
  type: 'learn' | 'review' | 'practice'
  label: string
  submissions: number
  correct: number
  incorrect: number
  conceptsMastered: number
  reviewsAdvanced: number
  cardsReset: number
  durationMs: number
}

export interface Settings {
  theme: 'dark' | 'light'
  sound: boolean
  dailyGoal: number
  preferredModes: RecallMode[]
  sessionSize: number
  /** Show the "reveal answer" escape hatch. */
  allowReveal: boolean
}

export interface StreakState {
  /** Current consecutive study days. */
  current: number
  longest: number
  /** Last local study day `YYYY-MM-DD`. */
  lastStudyDay: string | null
  /** Distinct study days, ascending. Capped at 400 entries. */
  days: string[]
}

export interface AppState {
  version: number
  cards: Record<string, CardProgress>
  sessions: SessionRecord[]
  streak: StreakState
  settings: Settings
}

/* ------------------------------------------------------------------ */
/* Derived view models                                                 */
/* ------------------------------------------------------------------ */

export interface WeekStats {
  week: number
  total: number
  /** Concepts that cleared the 3-correct gate (in a Leitner box). */
  mastered: number
  /** Concepts in a learning drill with the gate still open. */
  learning: number
  due: number
  notStarted: number
  masteryPercent: number
  /** Concepts sitting in Box 5. */
  deepMastered: number
  status: 'not-started' | 'in-progress' | 'mastered' | 'due'
}

export interface Overview {
  totalConcepts: number
  mastered: number
  learning: number
  dueToday: number
  overdue: number
  masteryPercent: number
  totalAttempts: number
  totalCorrect: number
  totalIncorrect: number
  accuracy: number
  reviewSuccessRate: number
  totalStudyMs: number
  boxCounts: Record<LeitnerBox, number>
  unscheduled: number
}

/** Where a session gets its cards from. */
export type SessionScope = 'module' | 'due' | 'practice' | 'weak' | 'mistakes'

export interface SessionConfig {
  scope: SessionScope
  week?: number
  limit: number
  /** Free-practice sessions never advance the review schedule. */
  type: 'learn' | 'review' | 'practice'
  label: string
  /** Explicit card ids, used by the "review my mistakes" flow. */
  ids?: string[]
}
