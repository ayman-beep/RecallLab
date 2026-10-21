import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { LeitnerBox } from '../types'
import { BOX_META, BOX_ORDER, LEITNER_INTERVALS } from '../engine/scheduler'

interface LeitnerChartProps {
  counts: Record<LeitnerBox, number>
  selected: LeitnerBox | null
  onSelect: (box: LeitnerBox | null) => void
}

export function LeitnerChart({ counts, selected, onSelect }: LeitnerChartProps) {
  const data = BOX_ORDER.map((box) => ({
    box,
    name: `Box ${box}`,
    interval: `${LEITNER_INTERVALS[box]}d`,
    cards: counts[box],
    color: BOX_META[box].color,
  }))

  return (
    <div>
      <div className="h-[176px] w-full" role="img" aria-label={`Leitner box distribution: ${data.map((d) => `${d.name} has ${d.cards} cards`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-app-muted"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-app-muted"
              axisLine={false}
              tickLine={false}
              width={26}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.09)' }}
              contentStyle={{
                background: 'rgb(var(--app-surface))',
                border: '1px solid rgb(var(--app-border))',
                borderRadius: 12,
                fontSize: 12,
                color: 'rgb(var(--app-text))',
              }}
              formatter={(value) => [`${value} cards`, 'Scheduled']}
            />
            <Bar dataKey="cards" radius={[6, 6, 0, 0]} onClick={(entry) => {
              const box = (entry as unknown as { box: LeitnerBox }).box
              onSelect(selected === box ? null : box)
            }}>
              {data.map((entry) => (
                <Cell
                  key={entry.box}
                  fill={entry.color}
                  fillOpacity={selected === null || selected === entry.box ? 0.9 : 0.28}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {BOX_ORDER.map((box) => {
          const active = selected === box
          return (
            <button
              key={box}
              type="button"
              onClick={() => onSelect(active ? null : box)}
              aria-pressed={active}
              className={`rounded-lg border px-1.5 py-2 text-center transition ${
                active
                  ? 'border-brand-500/50 bg-brand-500/10'
                  : 'border-app-border bg-app-raised hover:border-app-border/70'
              }`}
            >
              <span className="block text-[15px] font-semibold tabular-nums">{counts[box]}</span>
              <span className="block text-[10px] text-app-muted">
                Box {box} · {LEITNER_INTERVALS[box]}d
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
