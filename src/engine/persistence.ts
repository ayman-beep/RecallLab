/**
 * localStorage persistence + import/export with defensive sanitisation.
 *
 * Corrupt, partial, or outdated payloads must never crash the app: every field
 * is validated and repaired against defaults. Anything unrecognisable is
 * dropped rather than trusted.
 */

import type {
  AppState,
  CardProgress,
  LeitnerBox,
  RecallMode,
  ReviewEvent,
  SessionRecord,
  Settings,
  StreakState,
} from '../types'
import { isISODay } from '../utils/dates'
import { emptyStreak } from './streak'

export const STORAGE_KEY = 'recalllab.datascience.progress.v1'
export const SCHEMA_VERSION = 1

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  sound: true,
  dailyGoal: 20,
  preferredModes: ['short', 'cloze', 'categorize'],
  sessionSize: 8,
  allowReveal: true,
}

const RECALL_MODES: RecallMode[] = ['short', 'cloze', 'categorize']

export function createInitialState(): AppState {
  return {
    version: SCHEMA_VERSION,
    cards: {},
    sessions: [],
    streak: emptyStreak(),
    settings: { ...DEFAULT_SETTINGS },
  }
}

const clampNumber = (value: unknown, min: number, max: number, fallback: number): number => {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

const asBool = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback

function sanitizeEvent(raw: unknown): ReviewEvent | null {
  if (!raw || typeof raw !== 'object') return null
  const e = raw as Record<string, unknown>
  if (typeof e.at !== 'string') return null
  const boxBefore = clampNumber(e.boxBefore, 0, 5, 0) as LeitnerBox | 0
  const boxAfter = clampNumber(e.boxAfter, 0, 5, 0) as LeitnerBox | 0
  return {
    at: e.at,
    correct: Boolean(e.correct),
    mode: RECALL_MODES.includes(e.mode as RecallMode) ? (e.mode as RecallMode) : 'short',
    source:
      e.source === 'review' || e.source === 'practice' || e.source === 'learn'
        ? e.source
        : 'learn',
    boxBefore,
    boxAfter,
    day: isISODay(e.day) ? e.day : e.at.slice(0, 10),
  }
}

export function sanitizeCard(raw: unknown, id: string): CardProgress | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const gatePassed = asBool(r.gatePassed, false)
  const box = gatePassed ? clampNumber(r.box, 1, 5, 1) : 0
  const history = Array.isArray(r.history)
    ? r.history.map(sanitizeEvent).filter((e): e is ReviewEvent => Boolean(e)).slice(0, 40)
    : []
  return {
    id,
    consecutiveCorrect: clampNumber(r.consecutiveCorrect, 0, 3, 0),
    gatePassed,
    box: box as LeitnerBox | 0,
    nextReview: gatePassed && isISODay(r.nextReview) ? r.nextReview : null,
    lastAttempt: typeof r.lastAttempt === 'string' ? r.lastAttempt : null,
    gateClearedAt: typeof r.gateClearedAt === 'string' ? r.gateClearedAt : null,
    attempts: clampNumber(r.attempts, 0, 100000, 0),
    correct: clampNumber(r.correct, 0, 100000, 0),
    incorrect: clampNumber(r.incorrect, 0, 100000, 0),
    history,
  }
}

function sanitizeSession(raw: unknown): SessionRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.startedAt !== 'string' || typeof r.endedAt !== 'string') return null
  const type =
    r.type === 'review' || r.type === 'practice' || r.type === 'learn' ? r.type : 'learn'
  return {
    id: typeof r.id === 'string' ? r.id : `session_${r.startedAt}`,
    startedAt: r.startedAt,
    endedAt: r.endedAt,
    type,
    label: typeof r.label === 'string' ? r.label.slice(0, 120) : 'Study session',
    submissions: clampNumber(r.submissions, 0, 100000, 0),
    correct: clampNumber(r.correct, 0, 100000, 0),
    incorrect: clampNumber(r.incorrect, 0, 100000, 0),
    conceptsMastered: clampNumber(r.conceptsMastered, 0, 100000, 0),
    reviewsAdvanced: clampNumber(r.reviewsAdvanced, 0, 100000, 0),
    cardsReset: clampNumber(r.cardsReset, 0, 100000, 0),
    durationMs: clampNumber(r.durationMs, 0, 86_400_000, 0),
  }
}

function sanitizeStreak(raw: unknown): StreakState {
  if (!raw || typeof raw !== 'object') return emptyStreak()
  const r = raw as Record<string, unknown>
  const days = Array.isArray(r.days) ? r.days.filter(isISODay).sort().slice(-400) : []
  return {
    current: clampNumber(r.current, 0, 100000, 0),
    longest: clampNumber(r.longest, 0, 100000, 0),
    lastStudyDay: isISODay(r.lastStudyDay) ? r.lastStudyDay : null,
    days,
  }
}

export function sanitizeSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_SETTINGS }
  const r = raw as Record<string, unknown>
  const modes = Array.isArray(r.preferredModes)
    ? (r.preferredModes.filter((m) => RECALL_MODES.includes(m as RecallMode)) as RecallMode[])
    : []
  return {
    theme: r.theme === 'light' ? 'light' : 'dark',
    sound: asBool(r.sound, DEFAULT_SETTINGS.sound),
    dailyGoal: clampNumber(r.dailyGoal, 5, 200, DEFAULT_SETTINGS.dailyGoal),
    preferredModes: modes.length ? modes : [...DEFAULT_SETTINGS.preferredModes],
    sessionSize: clampNumber(r.sessionSize, 4, 40, DEFAULT_SETTINGS.sessionSize),
    allowReveal: asBool(r.allowReveal, DEFAULT_SETTINGS.allowReveal),
  }
}

/** Repair an arbitrary object into a usable AppState. */
export function sanitizeState(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') return createInitialState()
  const r = raw as Record<string, unknown>
  const cards: Record<string, CardProgress> = {}
  if (r.cards && typeof r.cards === 'object') {
    for (const [id, value] of Object.entries(r.cards as Record<string, unknown>)) {
      const card = sanitizeCard(value, id)
      if (card) cards[id] = card
    }
  }
  const sessions = Array.isArray(r.sessions)
    ? r.sessions
        .map(sanitizeSession)
        .filter((s): s is SessionRecord => Boolean(s))
        .slice(-300)
    : []
  return {
    version: SCHEMA_VERSION,
    cards,
    sessions,
    streak: sanitizeStreak(r.streak),
    settings: sanitizeSettings(r.settings),
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return createInitialState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    return sanitizeState(JSON.parse(raw))
  } catch {
    // Corrupt JSON: start clean rather than crash. The old blob is kept under a
    // backup key so nothing is silently destroyed.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) window.localStorage.setItem(`${STORAGE_KEY}.corrupt`, raw)
    } catch {
      /* ignore */
    }
    return createInitialState()
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* Storage full or unavailable (private mode) — keep the session usable. */
  }
}

export type ImportResult =
  | { ok: true; state: AppState; warnings: string[] }
  | { ok: false; error: string }

/** Validate a JSON payload from the import dialog. */
export function validateImport(raw: unknown): ImportResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: 'The file does not contain a JSON object.' }
  }
  const r = raw as Record<string, unknown>
  const candidate = r.state && typeof r.state === 'object' ? r.state : r
  const c = candidate as Record<string, unknown>
  if (!c.cards || typeof c.cards !== 'object' || !c.settings) {
    return {
      ok: false,
      error: 'Missing required fields. Expected an export produced by this app (cards + settings).',
    }
  }
  const state = sanitizeState(candidate)
  const warnings: string[] = []
  const rawCount = Object.keys(c.cards as Record<string, unknown>).length
  const keptCount = Object.keys(state.cards).length
  if (keptCount < rawCount) {
    warnings.push(`${rawCount - keptCount} malformed card records were discarded.`)
  }
  if (typeof r.version === 'number' && r.version > SCHEMA_VERSION) {
    warnings.push('The file was created by a newer version; unknown fields were ignored.')
  }
  return { ok: true, state, warnings }
}

export interface ExportPayload {
  app: 'recalllab-data-science'
  version: number
  exportedAt: string
  state: AppState
}

export function buildExport(state: AppState): ExportPayload {
  return {
    app: 'recalllab-data-science',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
}

export function downloadState(state: AppState): void {
  const payload = buildExport(state)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const day = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `recalllab-progress-${day}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
