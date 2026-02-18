import { useMode } from '../../context/ModeProvider'

export default function VitalsGrid() {
  const { currentCase } = useMode()

  const renderSection = (title, vitals) => (
    <div>
      {/* Section header */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text-mute)',
          padding: '12px 16px 5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {title}
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Vital rows */}
      {vitals.map((vital, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            padding: '5px 16px',
            gap: '8px',
          }}
        >
          {/* Name */}
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-mute)',
              width: '80px',
              flexShrink: 0,
            }}
          >
            {vital.name}
          </div>

          {/* Value */}
          <div
            style={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: '17px',
              fontWeight: 500,
              fontVariationSettings: '"opsz" 17',
              color: 'var(--text)',
              flex: 1,
            }}
          >
            {vital.value}
          </div>

          {/* Unit */}
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px',
              fontWeight: 300,
              color: 'var(--text-mute)',
            }}
          >
            {vital.unit}
          </div>

          {/* Flag dot */}
          {vital.flag && (
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background:
                  vital.flag === 'critical'
                    ? 'var(--crimson)'
                    : vital.flag === 'caution'
                      ? 'var(--amber)'
                      : 'transparent',
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )

  const renderHistory = (historyItems) => (
    <div>
      {/* Section header */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--text-mute)',
          padding: '12px 16px 5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        HISTORY
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* History entries */}
      {historyItems.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            padding: '7px 16px 9px 12px',
            marginLeft: '16px',
            borderLeft: `2px solid ${
              item.flag === 'critical' ? 'var(--crimson)' : 'var(--amber)'
            }`,
          }}
        >
          {/* Label */}
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-mute)',
            }}
          >
            {item.label}
          </div>

          {/* Text with HTML support */}
          <div
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px',
              lineHeight: '1.5',
              color: 'var(--text-dim)',
            }}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '8px',
      }}
    >
      {renderSection('BASIC VITALS', currentCase.basicVitals)}
      {renderSection('LABS', currentCase.labsVitals)}
      {renderHistory(currentCase.historyVitals)}
    </div>
  )
}
