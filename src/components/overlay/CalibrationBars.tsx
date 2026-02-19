import { useEffect, useState } from 'react'

const data = [
  { category: 'Cardiovascular Risk', yours: 85, expert: 95 },
  { category: 'Renal Consideration', yours: 65, expert: 75 },
  { category: 'Glycemic Control', yours: 70, expert: 60 },
]

export default function CalibrationBars() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimated(true), 350)
  }, [])

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index}>
          <div className="mb-1 text-[11px] text-[var(--text-secondary)]">{item.category}</div>

          <div className="mb-[2px] flex items-center gap-3">
            <span className="w-[90px] text-[10px] text-[var(--text-tertiary)]">Your reasoning</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--muted-bg)]">
              <div
                className="h-full rounded-full bg-[var(--teal)] transition-all duration-[1200ms] [transition-timing-function:var(--ease-out)]"
                style={{ width: animated ? `${item.yours}%` : '0%' }}
              />
            </div>
            <span className="w-[30px] text-right text-[10px] font-medium text-[var(--teal-dark)]">
              {item.yours}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-[90px] text-[10px] text-[var(--text-tertiary)]">Expert</span>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--muted-bg)]">
              <div
                className="h-full rounded-full bg-[var(--text-secondary)] transition-all duration-[1200ms] [transition-timing-function:var(--ease-out)]"
                style={{ width: animated ? `${item.expert}%` : '0%' }}
              />
            </div>
            <span className="w-[30px] text-right text-[10px] font-medium text-[var(--text-secondary)]">
              {item.expert}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
