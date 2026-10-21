import { formatDay, type ISODay } from '../utils/dates'

type Cell = { day: ISODay; submissions: number; level: 0 | 1 | 2 | 3 | 4 }

interface HeatmapProps {
  /** Columns of up to seven days, newest column last. */
  columns: { cells: Cell[]; max: number }[]
  /** Cell edge in pixels. */
  cell?: number
}

const LEVELS = [
  'bg-app-raised ring-1 ring-inset ring-app-border',
  'bg-brand-500/30 ring-1 ring-inset ring-brand-500/30',
  'bg-brand-500/50',
  'bg-brand-500/75',
  'bg-brand-400',
] as const

/** Study heatmap. Each cell exposes its count as text for screen readers. */
export function ActivityHeatmap({ columns, cell = 14 }: HeatmapProps) {
  const total = columns.reduce(
    (sum, col) => sum + col.cells.reduce((acc, c) => acc + c.submissions, 0),
    0,
  )
  const activeDays = columns.reduce(
    (sum, col) => sum + col.cells.filter((c) => c.submissions > 0).length,
    0,
  )
  const gap = cell >= 12 ? 4 : 3

  return (
    <div>
      <div className="flex items-start" style={{ gap }}>
        <div
          className="mr-0.5 flex flex-col justify-between text-[9px] leading-none text-app-muted"
          style={{ height: 7 * cell + 6 * gap }}
          aria-hidden="true"
        >
          {['Mon', 'Wed', 'Fri', 'Sun'].map((d, i) => (
            <span key={`${d}-${i}`}>{d}</span>
          ))}
        </div>
        <div className="flex" style={{ gap }}>
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col" style={{ gap }}>
              {col.cells.map((cellData) => (
                <div
                  key={cellData.day}
                  title={`${formatDay(cellData.day, { weekday: 'short', year: 'numeric' })}: ${cellData.submissions} submission${cellData.submissions === 1 ? '' : 's'}`}
                  style={{ width: cell, height: cell }}
                  className={`rounded-[3px] ${LEVELS[cellData.level]}`}
                >
                  <span className="sr-only">
                    {formatDay(cellData.day, { year: 'numeric' })}: {cellData.submissions}{' '}
                    submissions
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-app-muted">
        <span>
          {total} submission{total === 1 ? '' : 's'} on {activeDays} day
          {activeDays === 1 ? '' : 's'} in the last {columns.length} weeks
        </span>
        <span className="inline-flex items-center gap-1">
          Less
          {LEVELS.map((cls, i) => (
            <span
              key={i}
              className={`rounded-[2px] ${cls}`}
              style={{ width: 9, height: 9 }}
              aria-hidden="true"
            />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
