export default function RevealCard({ variant, patient, vitalKey, vitalData }) {
  const isCase = variant === 'case'
  const isVital = variant === 'vital'

  if (isCase) {
    return (
      <div
        className="relative overflow-hidden px-5 py-4 animate-[revealIn_0.44s_var(--ease-out)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(73,198,185,0.07) 0%, rgba(73,198,185,0.02) 100%)',
          border: '1px solid var(--teal-border)',
          borderRadius: 'var(--r)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--teal), transparent)',
            opacity: 0.5,
          }}
        />

        <div className="label-caps flex items-center gap-2 mb-3" style={{ color: 'var(--teal-dark)' }}>
          Case Presented
          <div className="flex-1 h-[1px]" style={{ background: 'var(--teal-border)' }} />
        </div>

        <div className="text-[13px] leading-[1.7]" style={{ color: 'var(--text)' }}>
          <strong style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>{patient.name}</strong>,{' '}
          {patient.age}M — {patient.chiefComplaint}
        </div>
      </div>
    )
  }

  if (isVital && vitalData) {
    const hasItems = vitalData.items && vitalData.items.length > 0
    const hasNarrative = vitalData.narrative

    return (
      <div
        className="relative overflow-hidden px-5 py-4 animate-[revealIn_0.44s_var(--ease-out)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(73,198,185,0.07), rgba(73,198,185,0.02))',
          border: '1px solid var(--teal-border)',
          borderRadius: 'var(--r)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--teal), transparent)',
            opacity: 0.5,
          }}
        />

        <div className="label-caps flex items-center gap-2 mb-2" style={{ color: 'var(--teal-dark)' }}>
          {vitalData.label} Revealed
          <div className="flex-1 h-[1px]" style={{ background: 'var(--teal-border)' }} />
        </div>

        {hasItems && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-2">
            {vitalData.items.map((item, idx) => (
              <div key={idx}>
                <div
                  className="text-[9px] uppercase tracking-[0.1em] mb-[2px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {item.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-[20px] font-medium"
                    style={{
                      fontFamily: '"Source Serif 4", serif',
                      fontVariationSettings: '"opsz" 20',
                      color: 'var(--text)',
                    }}
                  >
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-[9px] font-light" style={{ color: 'var(--text-mute)' }}>
                      {item.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasNarrative && (
          <div
            className="text-[13px] leading-[1.7] mt-2"
            style={{ color: 'var(--text)' }}
            dangerouslySetInnerHTML={{ __html: vitalData.narrative }}
          />
        )}
      </div>
    )
  }

  return null
}
