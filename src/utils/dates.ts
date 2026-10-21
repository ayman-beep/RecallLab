/**
 * Calendar-day helpers.
 *
 * The whole app stores review dates as local calendar days in `YYYY-MM-DD`
 * form. String comparison then works lexicographically, which avoids every
 * timezone/UTC pitfall that comes with storing raw timestamps for scheduling.
 */

const DAY_MS = 86_400_000

export type ISODay = string

/** Local calendar day for a Date instance (`YYYY-MM-DD`). */
export function toISODay(date: Date = new Date()): ISODay {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isISODay(value: unknown): value is ISODay {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/** Parse `YYYY-MM-DD` into a Date at local midnight. */
export function fromISODay(day: ISODay): Date {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(day: ISODay, days: number): ISODay {
  const date = fromISODay(day)
  date.setDate(date.getDate() + days)
  return toISODay(date)
}

/** Whole days from `a` to `b` (positive when b is later). */
export function diffDays(a: ISODay, b: ISODay): number {
  // Round to absorb DST shifts (±1h) so day maths stays exact.
  return Math.round((fromISODay(b).getTime() - fromISODay(a).getTime()) / DAY_MS)
}

/** A card is due when its scheduled day is today or earlier. */
export function isDue(
  nextReview: ISODay | null | undefined,
  today: ISODay = toISODay(),
): boolean {
  return Boolean(nextReview) && (nextReview as string) <= today
}

export function isOverdue(
  nextReview: ISODay | null | undefined,
  today: ISODay = toISODay(),
): boolean {
  return Boolean(nextReview) && (nextReview as string) < today
}

export function formatDay(day: ISODay | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!day) return '—'
  return fromISODay(day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...opts,
  })
}

export function formatLongDay(day: ISODay | null): string {
  if (!day) return '—'
  return fromISODay(day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Human relative label for a scheduled review day. */
export function relativeDay(
  day: ISODay | null,
  today: ISODay = toISODay(),
): string {
  if (!day) return 'Not scheduled'
  const delta = diffDays(today, day)
  if (delta === 0) return 'Due today'
  if (delta === 1) return 'Due tomorrow'
  if (delta === -1) return '1 day overdue'
  if (delta < 0) return `${Math.abs(delta)} days overdue`
  return `In ${delta} days`
}

export function formatDuration(ms: number): string {
  if (!ms || ms < 0) return '0m'
  const totalMinutes = Math.round(ms / 60000)
  if (totalMinutes < 1) return '<1m'
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${`${s}`.padStart(2, '0')}`
}

/** Monday-based start of the week containing `date`. */
export function startOfWeek(date: Date = new Date()): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = copy.getDay() // 0 = Sunday
  const delta = day === 0 ? -6 : 1 - day
  copy.setDate(copy.getDate() + delta)
  return copy
}

/** Ascending list of the last `count` calendar days, ending today. */
export function lastNDays(count: number, today: ISODay = toISODay()): ISODay[] {
  const days: ISODay[] = []
  for (let i = count - 1; i >= 0; i -= 1) days.push(addDays(today, -i))
  return days
}

export function weekdayShort(day: ISODay): string {
  return fromISODay(day).toLocaleDateString(undefined, { weekday: 'short' })
}

export function greeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour < 5) return 'Burning the midnight oil'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
