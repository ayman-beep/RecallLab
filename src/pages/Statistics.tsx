import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Target,
  TrendingDown,
  XCircle,
} from 'lucide-react'
import { useAppState } from '../context/AppStateContext'
import { concepts, weeks } from '../data/curriculum'
import {
  accuracyTrend,
  buildOverview,
  dailyActivity,
  heatmap,
  mostMissed,
  topicMastery,
  weekStats,
} from '../engine/stats'
import { displayStreak } from '../engine/streak'
import { PageHeader, SectionHeader } from '../components/ui/PageHeader'
import { StatTile } from '../components/ui/StatTile'
import { ProgressBar, RingProgress } from '../components/ui/ProgressBar'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { LeitnerChart } from '../components/LeitnerChart'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { formatDuration, formatDay, weekdayShort } from '../utils/dates'
import type { LeitnerBox } from '../types'

const TOOLTIP_STYLE = {
  background: 'rgb(var(--app-surface))',
  border: '1px solid rgb(var(--app-border))',
  borderRadius: 12,
  fontSize: 12,
  color: 'rgb(var(--app-text))',
} as const

export default function Statistics() {
  const { state, today, settings } = useAppState()
  const [box, setBox] = useState<LeitnerBox | null>(null)

  const overview = useMemo(() => buildOverview(concepts, state, today), [state, today])
  const stats = useMemo(() => weekStats(weeks, concepts, state.cards, today), [state.cards, today])
  const activity = useMemo(() => dailyActivity(state, 14), [state])
  const trend = useMemo(() => accuracyTrend(state, 14), [state])
  const heat = useMemo(() => heatmap(state, 14), [state])
  const missed = useMemo(() => mostMissed(concepts, state.cards, 6), [state.cards])
  const topics = useMemo(() => topicMastery(concepts, state.cards), [state.cards])
  const streak = displayStreak(state.streak, today)

  const weeklyData = stats.map((s) => ({
    week: `W${s.week}`,
    mastery: s.masteryPercent,
    deep: Math.round((s.deepMastered / Math.max(1, s.total)) * 100),
    weekNumber: s.week,
  }))

  const trendData = trend.map((row) => ({
    day: weekdayShort(row.day),
    label: formatDay(row.day),
    correct: row.correct,
    incorrect: row.incorrect,
    // Days with no submissions are gaps, not 0% accuracy.
    accuracy: row.correct + row.incorrect > 0 ? row.accuracy : null,
  }))

  const totalAttempts = overview.totalAttempts
  const hasActivity = totalAttempts > 0

  return (
    <div>
      <PageHeader
        eyebrow="Locally computed analytics"
        title="Statistics"
        description="Every number here is derived from your saved progress — nothing is hard-coded. Charts update the moment a drill is submitted."
        actions={
          <Link to="/learn" className="btn-secondary">
            <Target size={15} aria-hidden="true" /> Study more
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[280px_1fr]">
        <section className="card flex flex-col items-center justify-center p-5">
          <RingProgress value={overview.masteryPercent} size={132} stroke={10}>
            <span className="text-2xl font-semibold tabular-nums">{overview.masteryPercent}%</span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-app-muted">mastered</span>
          </RingProgress>
          <p className="mt-3 text-center text-xs text-app-muted">
            {overview.mastered} of {overview.totalConcepts} concepts cleared the gate
          </p>
          <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-app-border bg-app-raised px-3 py-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-app-muted">
              <Flame size={12} className={streak ? 'text-amber-400' : ''} aria-hidden="true" /> {streak} day streak
            </span>
            <span className="text-app-muted">longest {state.streak.longest}</span>
          </div>
          <div className="mt-2 w-full">
            <div className="mb-1 flex justify-between text-[10px] text-app-muted">
              <span>Today</span>
              <span className="tabular-nums">
                {overview.attemptsToday}/{settings.dailyGoal}
              </span>
            </div>
            <ProgressBar
              value={Math.min(100, Math.round((overview.attemptsToday / Math.max(1, settings.dailyGoal)) * 100))}
              label="Daily goal progress"
              height="sm"
              tone="amber"
            />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-3">
          <StatTile
            label="Submissions"
            value={totalAttempts}
            hint={`${overview.totalCorrect} correct · ${overview.totalIncorrect} incorrect`}
            icon={Activity}
            tone="brand"
          />
          <StatTile
            label="Accuracy"
            value={`${overview.accuracy}%`}
            hint="Across every submission"
            icon={CheckCircle2}
            tone={overview.accuracy >= 70 ? 'brand' : 'amber'}
          />
          <StatTile
            label="Review success"
            value={overview.reviewsCompleted ? `${overview.reviewSuccessRate}%` : '—'}
            hint={`${overview.reviewsCompleted} scheduled reviews`}
            icon={Layers}
            tone={overview.reviewSuccessRate >= 70 ? 'brand' : 'amber'}
          />
          <StatTile
            label="Study time"
            value={formatDuration(overview.totalStudyMs)}
            hint={`${overview.sessionsCount} session${overview.sessionsCount === 1 ? '' : 's'} logged`}
            icon={Clock}
            tone="violet"
          />
          <StatTile
            label="Scheduled"
            value={overview.mastered}
            hint={`${overview.boxCounts[5]} in Box 5 · deep mastery`}
            icon={BarChart3}
            tone="cyan"
          />
          <StatTile
            label="Due / overdue"
            value={`${overview.dueToday}/${overview.overdue}`}
            hint="Reviews waiting right now"
            icon={Target}
            tone={overview.dueToday ? 'amber' : 'muted'}
          />
        </div>
      </div>

      {!hasActivity && (
        <div className="mb-4">
          <EmptyState
            icon={BarChart3}
            title="No statistics yet"
            description="Complete a learning session and this page will fill in: mastery by week, submission accuracy, Leitner distribution, streaks and study time."
            action={
              <Link to="/learn" className="btn-primary">
                Start your first session
              </Link>
            }
          />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Weekly mastery comparison"
            description="Percent of each week's concepts that cleared the mastery gate."
            icon={<BarChart3 size={15} aria-hidden="true" />}
          />
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 6, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(148,163,184,0.08)' }} formatter={(value) => [`${value}%`, 'Mastery']} />
                <Bar dataKey="mastery" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((row) => (
                    <Cell
                      key={row.week}
                      fill={row.mastery >= 100 ? '#22d3ee' : row.mastery > 0 ? '#10b981' : '#334155'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Correct vs incorrect submissions"
            description="Last 14 days, from stored review history."
            icon={<Activity size={15} aria-hidden="true" />}
          />
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 4, right: 6, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="correct" name="Correct" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="incorrect" name="Incorrect" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Daily accuracy trend"
            description="Accuracy can dip while new, harder cards enter rotation."
            icon={<Activity size={15} aria-hidden="true" />}
          />
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--app-border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} interval={1} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-app-muted" axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, 'Accuracy']} />
                <Line type="monotone" dataKey="accuracy" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Leitner distribution"
            description="Cards per box. Click a box to filter."
            icon={<Layers size={15} aria-hidden="true" />}
          />
          <LeitnerChart counts={overview.boxCounts} selected={box} onSelect={setBox} />
          {box && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-xl border border-app-border bg-app-raised/60 p-2.5">
              <ul className="space-y-1">
                {concepts
                  .filter((c) => state.cards[c.id]?.gatePassed && state.cards[c.id]?.box === box)
                  .map((concept) => (
                    <li key={concept.id}>
                      <Link
                        to={`/curriculum/week/${concept.week}#${concept.id}`}
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 text-[11px] hover:bg-app-surface"
                      >
                        <span className="truncate">{concept.title}</span>
                        <span className="shrink-0 text-app-muted">{formatDay(state.cards[concept.id]?.nextReview ?? null)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <section className="card mt-4 p-4 sm:p-5">
        <SectionHeader
          title="Study activity"
          description="Submissions per day over the last 14 weeks."
          icon={<Activity size={15} aria-hidden="true" />}
        />
        <ActivityHeatmap columns={heat} />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {activity.slice(-7).map((row) => (
            <div key={row.day} className="rounded-lg border border-app-border bg-app-raised/60 p-2">
              <p className="text-[10px] uppercase tracking-wide text-app-muted">{weekdayShort(row.day)}</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">{row.submissions}</p>
              <p className="text-[10px] text-app-muted">{row.minutes} min</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Most frequently missed"
            description="Highest incorrect counts — good candidates for a targeted drill."
            icon={<XCircle size={15} aria-hidden="true" />}
            actions={
              missed.length > 0 ? (
                <Link
                  to={`/study?scope=mistakes&type=practice&limit=${settings.sessionSize}&ids=${missed.map((m) => m.concept.id).join(',')}`}
                  className="text-[11px] font-medium text-brand-400 hover:underline"
                >
                  Drill these
                </Link>
              ) : null
            }
          />
          {missed.length === 0 ? (
            <p className="rounded-xl border border-dashed border-app-border px-3 py-6 text-center text-xs text-app-muted">
              No missed answers yet — nothing to report.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {missed.map((row) => (
                <li key={row.concept.id}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <Link
                      to={`/curriculum/week/${row.concept.week}#${row.concept.id}`}
                      className="truncate font-medium hover:text-brand-300"
                    >
                      {row.concept.title}
                    </Link>
                    <span className="shrink-0 text-app-muted">
                      {row.incorrect} miss{row.incorrect === 1 ? '' : 'es'} · {row.accuracy}%
                    </span>
                  </div>
                  <div className="mt-1">
                    <ProgressBar value={row.accuracy} label={`Accuracy for ${row.concept.title}`} height="sm" tone={row.accuracy < 50 ? 'red' : 'amber'} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4 sm:p-5">
          <SectionHeader
            title="Weakest topics"
            description="Lowest mastery by topic, across all 14 weeks."
            icon={<TrendingDown size={15} aria-hidden="true" />}
          />
          <ul className="space-y-2">
            {topics.slice(0, 7).map((topic) => (
              <li key={topic.key} className="flex items-center justify-between gap-2 text-xs">
                <span className="min-w-0 truncate">
                  <span className="text-app-muted">W{topic.week} · </span>
                  {topic.topic}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="tabular-nums text-app-muted">
                    {topic.mastered}/{topic.total}
                  </span>
                  <Badge tone={topic.percent === 0 ? 'muted' : topic.percent < 50 ? 'amber' : 'brand'}>
                    {topic.percent}%
                  </Badge>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card mt-4 p-4 sm:p-5">
        <SectionHeader title="Recent sessions" description="Stored locally with duration and accuracy." icon={<Clock size={15} aria-hidden="true" />} />
        {state.sessions.length === 0 ? (
          <p className="text-xs text-app-muted">No sessions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="border-b border-app-border text-[10px] uppercase tracking-wider text-app-muted">
                  <th className="py-2 pr-3 font-semibold">Session</th>
                  <th className="py-2 pr-3 font-semibold">Type</th>
                  <th className="py-2 pr-3 text-right font-semibold">Submissions</th>
                  <th className="py-2 pr-3 text-right font-semibold">Correct</th>
                  <th className="py-2 pr-3 text-right font-semibold">Mastered</th>
                  <th className="py-2 text-right font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {[...state.sessions]
                  .reverse()
                  .slice(0, 8)
                  .map((session) => (
                    <tr key={session.id}>
                      <td className="max-w-[220px] truncate py-2 pr-3">
                        <span className="font-medium">{session.label}</span>
                        <span className="ml-1.5 text-[10px] text-app-muted">
                          {new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-app-muted">{session.type}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{session.submissions}</td>
                      <td className="py-2 pr-3 text-right tabular-nums text-brand-300">{session.correct}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{session.conceptsMastered}</td>
                      <td className="py-2 text-right tabular-nums text-app-muted">{formatDuration(session.durationMs)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
