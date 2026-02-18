import { useMode } from '../../context/ModeProvider'

export default function CaseIntroCard() {
  const { currentCase } = useMode()

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(73,198,185,0.07) 0%, rgba(73,198,185,0.02) 100%)',
        border: '1px solid var(--teal-border)',
        borderRadius: 'var(--r)',
        padding: '18px 22px',
        margin: '20px 20px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top shine effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, var(--teal), transparent)',
          opacity: 0.5,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--teal-dark)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        CASE BRIEF
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--teal-border)',
          }}
        />
      </div>

      {/* Prompt text */}
      <p
        style={{
          fontFamily: '"Source Serif 4", serif',
          fontSize: '16px',
          fontVariationSettings: '"opsz" 16',
          lineHeight: '1.7',
          color: 'var(--text)',
        }}
      >
        {currentCase.introPrompt}
      </p>
    </div>
  )
}
