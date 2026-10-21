import type { StreakState } from '../types'
import { addDays, diffDays, toISODay, type ISODay } from '../utils/dates'

export function emptyStreak(): StreakState {
  return { current: 0, longest: 0, lastStudyDay: null, days: [] }
}

/**
 * Register a study day. A streak continues when the previous study day was
 * yesterday (local calendar), and restarts at 1 after any longer gap.
 */
export function registerStudyDay(streak: StreakState, day: ISODay = toISODay()): StreakState {
  const base: StreakState = {
    current: streak?.current ?? 0,
    longest: streak?.longest ?? 0,
    lastStudyDay: streak?.lastStudyDay ?? null,
    days: Array.isArray(streak?.days) ? streak.days : [],
  }
  if (base.lastStudyDay === day) {
    return { ...base, days: base.days.includes(day) ? base.days : [...base.days, day].slice(-400) }
  }

  let current = 1
  if (base.lastStudyDay) {
    const gap = diffDays(base.lastStudyDay, day)
    if (gap === 1) current = base.current + 1
    else if (gap <= 0) current = base.current // clock moved backwards; never punish
  }

  const days = [...base.days.filter((d) => d !== day), day].sort().slice(-400)
  return {
    current,
    longest: Math.max(base.longest, current),
    lastStudyDay: day,
    days,
  }
}

/** Streak as displayed: stale streaks read as 0. */
export function displayStreak(streak: StreakState | undefined, day: ISODay = toISODay()): number {
  if (!streak?.lastStudyDay) return 0
  const gap = diffDays(streak.lastStudyDay, day)
  if (gap > 1) return 0
  return Math.max(streak.current, 1)
}

/** Whether the learner has already studied today. */
export function studiedOn(streak: StreakState | undefined, day: ISODay = toISODay()): boolean {
  return Boolean(streak?.days?.includes(day)) || streak?.lastStudyDay === day
}

/** Does today's study still count as "yesterday" (streak at risk)? */
export function streakAtRisk(streak: StreakState | undefined, day: ISODay = toISODay()): boolean {
  if (!streak?.lastStudyDay) return false
  return streak.lastStudyDay === addDays(day, -1)
}
