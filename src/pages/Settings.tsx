import { useRef, useState } from 'react'
import {
  Check,
  Download,
  Eye,
  FileJson,
  Info,
  Moon,
  RotateCcw,
  Save,
  Sun,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Badge } from '../components/ui/Badge'
import { curriculumMeta } from '../data/curriculum'
import { SCHEMA_VERSION, STORAGE_KEY, DEFAULT_SETTINGS } from '../engine/persistence'
import type { RecallMode } from '../types'
import { playSound } from '../utils/sound'

const MODE_LABEL: Record<RecallMode, { title: string; body: string }> = {
  short: {
    title: 'Short answer',
    body: 'Type the exact term or phrase. Normalised exact matching with explicit accepted variants.',
  },
  cloze: {
    title: 'Cloze deletion',
    body: 'Complete sentences with the missing terms. Every blank must be correct.',
  },
  categorize: {
    title: 'Categorization',
    body: 'Assign items to categories or select every correct option. Partial credit never counts.',
  },
}

export default function SettingsPage() {
  const { state, settings, updateSettings, resetProgress, exportProgress, importProgress, play } = useAppState()
  const [resetOpen, setResetOpen] = useState(false)
  const [importMessage, setImportMessage] = useState<{ tone: 'ok' | 'error'; text: string; warnings?: string[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleMode = (mode: RecallMode) => {
    const active = settings.preferredModes.includes(mode)
    const next = active
      ? settings.preferredModes.filter((m) => m !== mode)
      : [...settings.preferredModes, mode]
    // At least one recall mode must stay enabled.
    if (next.length === 0) return
    updateSettings({ preferredModes: next })
  }

  const handleFile = async (file: File) => {
    setImportMessage(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const result = importProgress(parsed)
      if (result.ok) {
        setImportMessage({
          tone: 'ok',
          text: 'Progress imported successfully. Your cards, reviews and streak were replaced with the file contents.',
          warnings: result.warnings,
        })
      } else {
        setImportMessage({ tone: 'error', text: result.error ?? 'Import failed.' })
      }
    } catch {
      setImportMessage({ tone: 'error', text: 'That file is not valid JSON. Export a fresh copy and try again.' })
    }
  }

  const cardCount = Object.keys(state.cards).length
  const scheduled = Object.values(state.cards).filter((c) => c.gatePassed).length

  return (
    <div>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Everything is stored in this browser's localStorage. Nothing is sent to a server."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <SectionHeader title="Appearance" description="Dark is the default study mode." icon={<Moon size={15} aria-hidden="true" />} />
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'light', label: 'Light', icon: Sun },
            ] as const).map((option) => {
              const active = settings.theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateSettings({ theme: option.value })}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
                    active
                      ? 'border-brand-500/50 bg-brand-500/10 text-app-text'
                      : 'border-app-border bg-app-raised text-app-muted hover:text-app-text'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <option.icon size={15} aria-hidden="true" /> {option.label}
                  </span>
                  {active && <Check size={14} className="text-brand-400" aria-hidden="true" />}
                </button>
              )
            })}
          </div>

          <div className="mt-4 space-y-2">
            <Toggle
              label="Sound effects"
              description="Short synthesised tones for correct, incorrect and completed cards."
              checked={settings.sound}
              onChange={(value) => {
                updateSettings({ sound: value })
                if (value) playSound('success', true)
              }}
              icon={settings.sound ? Volume2 : VolumeX}
            />
            <Toggle
              label="Allow “reveal answer”"
              description="Revealing counts as an incorrect attempt and resets the consecutive counter."
              checked={settings.allowReveal}
              onChange={(value) => updateSettings({ allowReveal: value })}
              icon={Eye}
            />
          </div>
        </section>

        <section className="card p-4 sm:p-5">
          <SectionHeader title="Study session" description="Applies to newly started sessions." icon={<Save size={15} aria-hidden="true" />} />
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="daily-goal" className="text-sm font-medium">
                  Daily goal
                </label>
                <Badge tone="amber">{settings.dailyGoal} submissions</Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-app-muted">
                Every submitted answer counts, correct or not — recall attempts are the unit of practice.
              </p>
              <input
                id="daily-goal"
                type="range"
                min={5}
                max={100}
                step={5}
                value={settings.dailyGoal}
                onChange={(event) => updateSettings({ dailyGoal: Number(event.target.value) })}
                className="mt-2 w-full accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-app-muted">
                <span>5</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="session-size" className="text-sm font-medium">
                  Session size
                </label>
                <Badge tone="muted">{settings.sessionSize} cards</Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-app-muted">
                Maximum distinct concepts presented in one session.
              </p>
              <input
                id="session-size"
                type="range"
                min={4}
                max={24}
                step={1}
                value={settings.sessionSize}
                onChange={(event) => updateSettings({ sessionSize: Number(event.target.value) })}
                className="mt-2 w-full accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-app-muted">
                <span>4</span>
                <span>14</span>
                <span>24</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Preferred recall modes</p>
              <p className="mt-0.5 text-[11px] text-app-muted">
                Cards using disabled modes are skipped when a session is built. At least one must stay on.
              </p>
              <div className="mt-2 space-y-1.5">
                {(Object.keys(MODE_LABEL) as RecallMode[]).map((mode) => {
                  const active = settings.preferredModes.includes(mode)
                  const isLast = settings.preferredModes.length === 1 && active
                  return (
                    <label
                      key={mode}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                        active ? 'border-brand-500/40 bg-brand-500/[0.06]' : 'border-app-border bg-app-raised'
                      } ${isLast ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleMode(mode)}
                        disabled={isLast}
                        className="mt-0.5 h-4 w-4 accent-brand-500"
                      />
                      <span>
                        <span className="block text-xs font-medium">{MODE_LABEL[mode].title}</span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-app-muted">
                          {MODE_LABEL[mode].body}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <SectionHeader title="Progress data" description="Export a backup, or restore one on another device." icon={<FileJson size={15} aria-hidden="true" />} />
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" className="btn-secondary" onClick={exportProgress}>
              <Download size={14} aria-hidden="true" /> Export JSON
            </button>
            <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={14} aria-hidden="true" /> Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleFile(file)
                event.target.value = ''
              }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-app-muted">
            The export contains card mastery, review dates, session history and preferences. It never
            contains personal information — only learning state.
          </p>

          {importMessage && (
            <div
              role="status"
              className={`mt-3 rounded-xl border px-3 py-2.5 text-[11px] leading-relaxed ${
                importMessage.tone === 'ok'
                  ? 'border-brand-500/35 bg-brand-500/[0.07] text-brand-200'
                  : 'border-red-500/35 bg-red-500/[0.07] text-red-200'
              }`}
            >
              <p>{importMessage.text}</p>
              {importMessage.warnings && importMessage.warnings.length > 0 && (
                <ul className="mt-1 list-disc pl-4">
                  {importMessage.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-app-border bg-app-raised/60 p-3 text-[11px] text-app-muted">
            <div className="flex justify-between">
              <span>Cards with progress</span>
              <span className="tabular-nums text-app-text">
                {cardCount}/{curriculumMeta.conceptCount}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Scheduled cards</span>
              <span className="tabular-nums text-app-text">{scheduled}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Sessions stored</span>
              <span className="tabular-nums text-app-text">{state.sessions.length}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Schema version</span>
              <span className="tabular-nums text-app-text">{SCHEMA_VERSION}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Storage key</span>
              <code className="text-[10px] text-app-text">{STORAGE_KEY}</code>
            </div>
          </div>
        </section>

        <section className="card border-red-500/25 p-4 sm:p-5">
          <SectionHeader
            title="Danger zone"
            description="Irreversible actions. Export a backup first."
            icon={<Trash2 size={15} aria-hidden="true" />}
          />
          <div className="space-y-2">
            <button type="button" className="btn-danger w-full" onClick={() => setResetOpen(true)}>
              <RotateCcw size={14} aria-hidden="true" /> Reset all progress
            </button>
            <button
              type="button"
              className="btn-ghost w-full text-xs"
              onClick={() => {
                updateSettings({ ...DEFAULT_SETTINGS })
                play('click')
              }}
            >
              Restore default preferences
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-app-muted">
            Resetting removes card mastery, Leitner boxes, review dates, session history and your streak.
            Preferences and theme are kept.
          </p>

          <div className="mt-4 rounded-xl border border-app-border bg-app-raised/60 p-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-app-text">
              <Info size={12} aria-hidden="true" /> Answer matching rules
            </p>
            <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-app-muted">
              <li>· Leading/trailing whitespace ignored; internal spaces collapsed.</li>
              <li>· Case-insensitive comparison.</li>
              <li>· A single trailing full stop, comma or semicolon is ignored.</li>
              <li>· Only explicitly configured variants are accepted — no fuzzy matching.</li>
              <li>· Every cloze blank and every categorization item must be correct.</li>
            </ul>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset all progress?"
        description={
          <span>
            This permanently deletes the mastery state of {cardCount} card{cardCount === 1 ? '' : 's'},
            your {state.sessions.length} stored session{state.sessions.length === 1 ? '' : 's'} and your{' '}
            {state.streak.current}-day streak. This cannot be undone without an exported backup.
          </span>
        }
        confirmLabel="Delete my progress"
        cancelLabel="Keep my progress"
        tone="danger"
        onConfirm={() => {
          resetProgress()
          setResetOpen(false)
          setImportMessage({ tone: 'ok', text: 'All progress has been reset. Preferences were kept.' })
        }}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-app-border bg-app-raised px-3 py-2.5">
      <div className="flex gap-2">
        <Icon size={14} className="mt-0.5 shrink-0 text-app-muted" aria-hidden />
        <div>
          <p className="text-xs font-medium">{label}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-app-muted">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full border transition ${
          checked ? 'border-brand-500/50 bg-brand-500/70' : 'border-app-border bg-app-surface'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}
