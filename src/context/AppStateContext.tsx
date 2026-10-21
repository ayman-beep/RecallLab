import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppState,
  AttemptSource,
  CardProgress,
  RecallMode,
  SessionRecord,
  Settings,
} from '../types'
import { conceptById } from '../data/curriculum'
import {
  applyAttempt,
  createProgress,
  type AttemptOutcome,
} from '../engine/scheduler'
import {
  createInitialState,
  downloadState,
  loadState,
  saveState,
  sanitizeState,
  validateImport,
} from '../engine/persistence'
import { registerStudyDay } from '../engine/streak'
import { toISODay, type ISODay } from '../utils/dates'
import { playSound, type SoundKind } from '../utils/sound'

interface AppStateContextValue {
  state: AppState
  settings: Settings
  /** Local calendar day, refreshed when the tab regains focus. */
  today: ISODay
  cards: Record<string, CardProgress>
  getCard: (id: string) => CardProgress | undefined
  recordAttempt: (
    conceptId: string,
    correct: boolean,
    source: AttemptSource,
    mode: RecallMode,
  ) => AttemptOutcome
  recordSession: (record: Omit<SessionRecord, 'id'>) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetProgress: () => void
  exportProgress: () => void
  importProgress: (raw: unknown) => { ok: boolean; error?: string; warnings?: string[] }
  play: (kind: SoundKind) => void
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

function normalizeState(raw: AppState): AppState {
  // Drop card records that no longer exist in the curriculum (removed cards,
  // renamed ids from older exports) so statistics never count ghosts.
  const cards: Record<string, CardProgress> = {}
  for (const [id, card] of Object.entries(raw.cards)) {
    if (conceptById.has(id)) cards[id] = card
  }
  return { ...raw, cards }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => normalizeState(loadState()), [])
  const [state, setState] = useState<AppState>(initial)
  const stateRef = useRef<AppState>(initial)
  const [today, setToday] = useState<ISODay>(() => toISODay())

  const commit = useCallback((next: AppState) => {
    stateRef.current = next
    setState(next)
  }, [])

  // Persist on every change.
  useEffect(() => {
    saveState(state)
  }, [state])

  // Theme application.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', state.settings.theme === 'dark')
    root.style.colorScheme = state.settings.theme
  }, [state.settings.theme])

  // Keep "today" honest across midnight / tab switches.
  useEffect(() => {
    const sync = () => setToday(toISODay())
    const timer = window.setInterval(sync, 60_000)
    window.addEventListener('focus', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  const getCard = useCallback((id: string) => stateRef.current.cards[id], [])

  const recordAttempt = useCallback(
    (conceptId: string, correct: boolean, source: AttemptSource, mode: RecallMode) => {
      const prev = stateRef.current
      const current = prev.cards[conceptId] ?? createProgress(conceptId)
      const outcome = applyAttempt(current, {
        correct,
        source,
        mode,
        today: toISODay(),
      })
      commit({
        ...prev,
        cards: { ...prev.cards, [conceptId]: outcome.progress },
        streak: registerStudyDay(prev.streak),
      })
      return outcome
    },
    [commit],
  )

  const recordSession = useCallback(
    (record: Omit<SessionRecord, 'id'>) => {
      const prev = stateRef.current
      const entry: SessionRecord = {
        ...record,
        id: `s_${record.startedAt}_${Math.random().toString(36).slice(2, 7)}`,
      }
      commit({ ...prev, sessions: [...prev.sessions, entry].slice(-200) })
    },
    [commit],
  )

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const prev = stateRef.current
      commit({ ...prev, settings: { ...prev.settings, ...patch } })
    },
    [commit],
  )

  const resetProgress = useCallback(() => {
    const prev = stateRef.current
    const fresh = createInitialState()
    commit({ ...fresh, settings: prev.settings })
  }, [commit])

  const exportProgress = useCallback(() => {
    downloadState(stateRef.current)
  }, [])

  const importProgress = useCallback(
    (raw: unknown) => {
      const result = validateImport(raw)
      if (!result.ok) return { ok: false, error: result.error }
      const merged = normalizeState(result.state)
      // Keep the learner's current theme if the import is theme-less/corrupt.
      const settings = { ...stateRef.current.settings, ...merged.settings }
      commit({ ...merged, settings: sanitizeState({ settings }).settings })
      return { ok: true, warnings: result.warnings }
    },
    [commit],
  )

  const play = useCallback(
    (kind: SoundKind) => playSound(kind, stateRef.current.settings.sound),
    [],
  )

  const value: AppStateContextValue = {
    state,
    settings: state.settings,
    today,
    cards: state.cards,
    getCard,
    recordAttempt,
    recordSession,
    updateSettings,
    resetProgress,
    exportProgress,
    importProgress,
    play,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>')
  return ctx
}
