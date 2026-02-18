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
          <div className="text-[11px] mb-1" style={{ color: 'var(--text-dim)' }}>
            {item.category}
          </div>

          <div className="flex items-center gap-3 mb-[2px]">
            <span className="text-[10px] w-[90px]" style={{ color: 'var(--text-mute)' }}>
              Your reasoning
            </span>
            <div
              className="h-[3px] flex-1 rounded-full overflow-hidden"
              style={{ background: 'var(--muted-bg)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-[1200ms]"
                style={{
                  width: animated ? `${item.yours}%` : '0%',
                  background: 'var(--gold)',
                  transitionTimingFunction: 'var(--ease-out)',
                }}
              />
            </div>
            <span className="text-[10px] w-[30px] text-right font-medium" style={{ color: 'var(--gold)' }}>
              {item.yours}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] w-[90px]" style={{ color: 'var(--text-mute)' }}>
              Expert
            </span>
            <div
              className="h-[3px] flex-1 rounded-full overflow-hidden"
              style={{ background: 'var(--muted-bg)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-[1200ms]"
                style={{
                  width: animated ? `${item.expert}%` : '0%',
                  background: 'var(--green)',
                  transitionTimingFunction: 'var(--ease-out)',
                }}
              />
            </div>
            <span className="text-[10px] w-[30px] text-right font-medium" style={{ color: 'var(--green)' }}>
              {item.expert}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
